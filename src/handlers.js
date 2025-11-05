/**
 * Handlers adicionales para posts, generación de contenido y publicación
 */

// ========================================
// POSTS POR PROYECTO
// ========================================

export async function handleAddProjectPost(projectId, request, env, corsHeaders) {
  const data = await request.json();
  
  const newPost = {
    id: generateId(),
    url: data.url,
    message: data.message,
    title: data.title || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    aiGenerated: data.aiGenerated || false
  };

  const projectPosts = await env.FB_PUBLISHER_KV.get(`project:${projectId}:posts`, { type: 'json' }) || { posts: [] };
  projectPosts.posts.push(newPost);
  
  await env.FB_PUBLISHER_KV.put(`project:${projectId}:posts`, JSON.stringify(projectPosts));
  await updateProjectStats(projectId, env, 'add');

  return new Response(JSON.stringify({ success: true, post: newPost }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

export async function handleBulkAddProjectPosts(projectId, request, env, corsHeaders) {
  const { posts, generateContent } = await request.json();
  
  let newPosts = [];
  
  if (generateContent && env.OPENAI_API_KEY) {
    // Generar contenido con IA para cada URL
    for (const post of posts) {
      const content = await generateContentFromURL(post.url, post.context || '', env);
      newPosts.push({
        id: generateId(),
        url: post.url,
        message: content.message,
        title: content.title,
        status: 'pending',
        createdAt: new Date().toISOString(),
        aiGenerated: true
      });
    }
  } else {
    // Agregar posts sin generación de IA
    newPosts = posts.map(post => ({
      id: generateId(),
      url: post.url,
      message: post.message,
      title: post.title || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      aiGenerated: false
    }));
  }

  const projectPosts = await env.FB_PUBLISHER_KV.get(`project:${projectId}:posts`, { type: 'json' }) || { posts: [] };
  projectPosts.posts.push(...newPosts);
  
  await env.FB_PUBLISHER_KV.put(`project:${projectId}:posts`, JSON.stringify(projectPosts));
  
  // Actualizar estadísticas
  for (let i = 0; i < newPosts.length; i++) {
    await updateProjectStats(projectId, env, 'add');
  }

  return new Response(JSON.stringify({ success: true, count: newPosts.length, posts: newPosts }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

export async function handleDeleteProjectPost(projectId, postId, env, corsHeaders) {
  const projectPosts = await env.FB_PUBLISHER_KV.get(`project:${projectId}:posts`, { type: 'json' }) || { posts: [] };
  projectPosts.posts = projectPosts.posts.filter(p => p.id !== postId);
  
  await env.FB_PUBLISHER_KV.put(`project:${projectId}:posts`, JSON.stringify(projectPosts));

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// ========================================
// GENERACIÓN DE CONTENIDO CON IA
// ========================================

export async function handleGenerateContent(request, env, corsHeaders) {
  const { url, context, template } = await request.json();
  
  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ 
      error: 'API Key de OpenAI no configurada' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const content = await generateContentFromURL(url, context, env, template);
    
    return new Response(JSON.stringify({ 
      success: true, 
      content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function handleGenerateBulkContent(request, env, corsHeaders) {
  const { urls, context, template } = await request.json();
  
  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ 
      error: 'API Key de OpenAI no configurada' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const results = [];
  
  for (const url of urls) {
    try {
      const content = await generateContentFromURL(url, context, env, template);
      results.push({
        url,
        success: true,
        content
      });
    } catch (error) {
      results.push({
        url,
        success: false,
        error: error.message
      });
    }
    
    // Pequeña pausa para no sobrecargar la API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return new Response(JSON.stringify({ 
    success: true, 
    results 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * Genera contenido usando OpenAI basándose en la URL
 */
async function generateContentFromURL(url, context = '', env, template = '') {
  // Obtener contenido de la URL
  let pageContent = '';
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Extraer título y descripción básica
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    
    pageContent = `Título: ${titleMatch ? titleMatch[1] : 'Sin título'}
Descripción: ${descMatch ? descMatch[1] : 'Sin descripción'}`;
  } catch (error) {
    console.log('No se pudo obtener contenido de la URL:', error.message);
    pageContent = `URL: ${url}`;
  }

  // Crear el prompt para OpenAI
  const systemPrompt = template || `Eres un experto en marketing de redes sociales. 
Tu tarea es crear publicaciones atractivas y engagement para Facebook basándote en el contenido de una página web.
El mensaje debe ser corto (máximo 200 caracteres), atractivo, usar emojis relevantes, y motivar a hacer clic.`;

  const userPrompt = `Crea un post para Facebook basado en esta página web:

${pageContent}

${context ? `Contexto adicional: ${context}` : ''}

Responde SOLO con un objeto JSON con este formato:
{
  "title": "Título corto y atractivo",
  "message": "Mensaje para el post (máximo 200 caracteres, con emojis)"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la API de OpenAI');
    }

    const content = data.choices[0].message.content;
    
    // Intentar parsear el JSON de la respuesta
    try {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || '',
        message: parsed.message || content
      };
    } catch (e) {
      // Si no es JSON válido, usar el contenido directamente
      return {
        title: '',
        message: content.substring(0, 200)
      };
    }
  } catch (error) {
    console.error('Error generando contenido con IA:', error);
    throw error;
  }
}

// ========================================
// PUBLICACIÓN
// ========================================

export async function handlePublishProjectPost(projectId, env, corsHeaders) {
  const projectPosts = await env.FB_PUBLISHER_KV.get(`project:${projectId}:posts`, { type: 'json' }) || { posts: [] };
  const pendingPosts = projectPosts.posts.filter(p => p.status === 'pending');

  if (pendingPosts.length === 0) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'No hay posts pendientes en este proyecto' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const nextPost = pendingPosts[0];
  const result = await publishPostToFacebook(projectId, nextPost, env);

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

export async function handleManualPublish(request, env, corsHeaders) {
  const { projectId, postId } = await request.json();
  
  if (projectId && postId) {
    // Publicar un post específico
    const projectPosts = await env.FB_PUBLISHER_KV.get(`project:${projectId}:posts`, { type: 'json' }) || { posts: [] };
    const post = projectPosts.posts.find(p => p.id === postId);
    
    if (!post) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Post no encontrado' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const result = await publishPostToFacebook(projectId, post, env);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } else {
    // Publicar el siguiente post pendiente de cualquier proyecto
    const result = await publishNextPost(env);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// ========================================
// ESTADÍSTICAS
// ========================================

export async function handleGetStats(env, corsHeaders) {
  const projects = await env.FB_PUBLISHER_KV.get('projects', { type: 'json' }) || { projects: [] };
  
  let totalStats = {
    totalProjects: projects.projects.length,
    activeProjects: projects.projects.filter(p => p.active).length,
    totalPosts: 0,
    publishedPosts: 0,
    pendingPosts: 0,
    errorPosts: 0,
    lastPublish: null
  };
  
  for (const project of projects.projects) {
    const stats = await env.FB_PUBLISHER_KV.get(`project:${project.id}:stats`, { type: 'json' });
    if (stats) {
      totalStats.totalPosts += stats.totalPosts || 0;
      totalStats.publishedPosts += stats.publishedPosts || 0;
      totalStats.pendingPosts += stats.pendingPosts || 0;
      totalStats.errorPosts += stats.errorPosts || 0;
      
      if (stats.lastPublish && (!totalStats.lastPublish || stats.lastPublish > totalStats.lastPublish)) {
        totalStats.lastPublish = stats.lastPublish;
      }
    }
  }

  return new Response(JSON.stringify(totalStats), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

export async function handleGetProjectStats(projectId, env, corsHeaders) {
  const stats = await env.FB_PUBLISHER_KV.get(`project:${projectId}:stats`, { type: 'json' }) || {
    totalPosts: 0,
    publishedPosts: 0,
    pendingPosts: 0,
    errorPosts: 0,
    lastPublish: null
  };

  return new Response(JSON.stringify(stats), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// ========================================
// UTILIDADES
// ========================================

export async function updateProjectStats(projectId, env, action) {
  const stats = await env.FB_PUBLISHER_KV.get(`project:${projectId}:stats`, { type: 'json' }) || {
    totalPosts: 0,
    publishedPosts: 0,
    pendingPosts: 0,
    errorPosts: 0,
    lastPublish: null
  };

  if (action === 'add') {
    stats.totalPosts++;
    stats.pendingPosts++;
  } else if (action === 'published') {
    stats.publishedPosts++;
    stats.pendingPosts = Math.max(0, stats.pendingPosts - 1);
    stats.lastPublish = new Date().toISOString();
  } else if (action === 'error') {
    stats.errorPosts++;
    stats.pendingPosts = Math.max(0, stats.pendingPosts - 1);
  }

  await env.FB_PUBLISHER_KV.put(`project:${projectId}:stats`, JSON.stringify(stats));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Publica un post en Facebook usando la Graph API
 */
export async function publishToFacebook(post, env) {
  const pageAccessToken = env.FB_PAGE_ACCESS_TOKEN;
  const pageId = env.FB_PAGE_ID;
  const apiVersion = env.FACEBOOK_API_VERSION || 'v18.0';

  if (!pageAccessToken || !pageId) {
    return { success: false, error: 'Credenciales de Facebook no configuradas' };
  }

  const apiUrl = `https://graph.facebook.com/${apiVersion}/${pageId}/feed`;

  // Preparar el mensaje con la URL
  const message = `${post.message}\n\n${post.url}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        link: post.url,
        access_token: pageAccessToken,
      }),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      return { success: true, postId: data.id };
    } else {
      return { success: false, error: data.error?.message || 'Error desconocido' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Publica un post específico de un proyecto en Facebook
 */
export async function publishPostToFacebook(projectId, post, env) {
  // Obtener configuración del proyecto
  const projects = await env.FB_PUBLISHER_KV.get('projects', { type: 'json' }) || { projects: [] };
  const project = projects.projects.find(p => p.id === projectId);
  
  if (!project) {
    return { success: false, error: 'Proyecto no encontrado' };
  }

  // Publicar en Facebook
  const fbResponse = await publishToFacebook(post, env);

  // Actualizar el post
  const projectPosts = await env.FB_PUBLISHER_KV.get(`project:${projectId}:posts`, { type: 'json' }) || { posts: [] };
  const postIndex = projectPosts.posts.findIndex(p => p.id === post.id);
  
  if (postIndex !== -1) {
    if (fbResponse.success) {
      projectPosts.posts[postIndex].status = 'published';
      projectPosts.posts[postIndex].publishedAt = new Date().toISOString();
      projectPosts.posts[postIndex].facebookPostId = fbResponse.postId;
      
      await updateProjectStats(projectId, env, 'published');
      console.log(`Post publicado: ${post.id} del proyecto ${projectId}`);
    } else {
      projectPosts.posts[postIndex].status = 'error';
      projectPosts.posts[postIndex].lastError = fbResponse.error;
      projectPosts.posts[postIndex].errorAt = new Date().toISOString();
      
      await updateProjectStats(projectId, env, 'error');
      console.error(`Error al publicar: ${fbResponse.error}`);
    }
    
    await env.FB_PUBLISHER_KV.put(`project:${projectId}:posts`, JSON.stringify(projectPosts));
  }

  return fbResponse.success ? 
    { success: true, post: projectPosts.posts[postIndex], project: project.name } :
    { success: false, error: fbResponse.error };
}

/**
 * Publica el siguiente post pendiente en Facebook (de todos los proyectos)
 */
export async function publishNextPost(env) {
  // Obtener todos los proyectos
  const projects = await env.FB_PUBLISHER_KV.get('projects', { type: 'json' }) || { projects: [] };
  
  // Buscar posts pendientes en todos los proyectos activos
  for (const project of projects.projects) {
    if (!project.active) continue;
    
    const projectPosts = await env.FB_PUBLISHER_KV.get(`project:${project.id}:posts`, { type: 'json' }) || { posts: [] };
    const pendingPosts = projectPosts.posts.filter(p => p.status === 'pending');
    
    if (pendingPosts.length > 0) {
      const nextPost = pendingPosts[0];
      const result = await publishPostToFacebook(project.id, nextPost, env);
      return result;
    }
  }

  console.log('No hay posts pendientes para publicar');
  return { success: false, message: 'No hay posts pendientes en ningún proyecto' };
}
