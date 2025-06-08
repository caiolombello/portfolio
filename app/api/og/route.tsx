import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getSiteConfigEdge } from "@/lib/config-edge";

export const runtime = "edge";

type PageType = 'home' | 'about' | 'resume' | 'portfolio' | 'blog' | 'contact' | 'other';

function detectPageType(title: string): PageType {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('sobre') || lowerTitle.includes('about')) return 'about';
  if (lowerTitle.includes('currículo') || lowerTitle.includes('resume') || lowerTitle.includes('cv')) return 'resume';
  if (lowerTitle.includes('projeto') || lowerTitle.includes('portfolio') || lowerTitle.includes('trabalho')) return 'portfolio';
  if (lowerTitle.includes('blog') || lowerTitle.includes('artigo') || lowerTitle.includes('post')) return 'blog';
  if (lowerTitle.includes('contato') || lowerTitle.includes('contact')) return 'contact';
  
  return 'other';
}

function getPageSubtitle(pageType: PageType, defaultSubtitle: string): string {
  const subtitles = {
    about: "Conheça minha trajetória profissional e experiências",
    resume: "Experiência profissional, formação e certificações",
    portfolio: "Projetos desenvolvidos e soluções implementadas",
    blog: "Artigos técnicos e insights sobre tecnologia",
    contact: "Vamos conversar sobre seu próximo projeto",
    other: defaultSubtitle,
    home: defaultSubtitle
  };
  
  return subtitles[pageType];
}

function getPageIcon(pageType: PageType): string {
  const icons = {
    about: "👨‍💻",
    resume: "📄",
    portfolio: "🚀",
    blog: "📝",
    contact: "💬",
    other: "💼",
    home: "🏠"
  };
  
  return icons[pageType];
}

// Função para converter Uint8Array para base64 usando método nativo
function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  try {
    // Verificar se o array não está vazio
    if (!uint8Array || uint8Array.length === 0) {
      return '';
    }

    // Usar método mais simples e confiável
    const buffer = Buffer.from(uint8Array);
    const base64 = buffer.toString('base64');
    
    return base64;
  } catch (error) {
    return '';
  }
}

async function loadProfileImage(imageUrl: string, baseUrl: string) {
  try {
    // Se é uma URL relativa, converter para absoluta
    const fullUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}${imageUrl}`;
    
    
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    return uint8Array;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Determinar URL base
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : request.url.includes('localhost') || request.url.includes('192.168.15.2')
        ? request.url.includes('192.168.15.2') ? 'http://192.168.15.2:3000' : 'http://localhost:3000'
        : 'https://portfolio-template.vercel.app';

 
    const config = await getSiteConfigEdge(baseUrl);
 
    // Parâmetros dinâmicos baseados na configuração
    const title = searchParams.get("title") || config.site.shortName;
    const subtitle = searchParams.get("subtitle") || config.site.description;
    const isHomepage = !searchParams.get("title"); // Se não tem título específico, é a página principal
    
    // Detectar tipo de página baseado no título para customizar layout
    const pageType = detectPageType(title.toLowerCase());
    
    // Personalizar subtítulo baseado no tipo de página se não fornecido
    const finalSubtitle = searchParams.get("subtitle") || getPageSubtitle(pageType, config.site.description);

    // Mostrar foto de perfil na homepage e na página sobre (ambas são sobre a pessoa)
    const shouldShowProfileImage = isHomepage || pageType === 'about';
    const useProfileLayout = shouldShowProfileImage;

    // Carregar imagem de perfil se necessário
    let profileImageData = null;
    if (shouldShowProfileImage) {
      // Tentar carregar usando a configuração do site
      const profileImageConfig = config.site.profileImage;
      
      // Se é um objeto de configuração, usar o sistema novo
      if (typeof profileImageConfig === 'object' && profileImageConfig.type) {
        
        // Tentar a fonte principal primeiro
        if (profileImageConfig.type === 'github') {
          const githubUrl = `https://github.com/${profileImageConfig.source}.png`;
          profileImageData = await loadProfileImage(githubUrl, baseUrl);
        } else if (profileImageConfig.type === 'local') {
          profileImageData = await loadProfileImage(profileImageConfig.source, baseUrl);
        }
        
        // Se falhou e tem fallbacks, tentar eles
        if (!profileImageData && profileImageConfig.fallbacks) {
          for (const fallback of profileImageConfig.fallbacks) {
            if (fallback.type === 'local') {
              profileImageData = await loadProfileImage(fallback.source, baseUrl);
              if (profileImageData) break;
            } else if (fallback.type === 'github') {
              const fallbackGithubUrl = `https://github.com/${fallback.source}.png`;
              profileImageData = await loadProfileImage(fallbackGithubUrl, baseUrl);
              if (profileImageData) break;
            }
          }
        }
      }
      // Fallback para configuração antiga (string)
      else if (typeof profileImageConfig === 'string') {
        profileImageData = await loadProfileImage(profileImageConfig, baseUrl);
      }
      // Fallback final para GitHub hardcoded
      else {
        profileImageData = await loadProfileImage('https://github.com/caiolombello.png', baseUrl);
      }
      
      
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%)",
            position: "relative",
          }}
        >
          {/* Padrão de fundo decorativo */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
            }}
          />

          {/* Container principal */}
          <div
            style={{
              display: "flex",
              flexDirection: useProfileLayout ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: useProfileLayout ? "60px" : "20px",
              width: "90%",
              height: "90%",
              border: "3px solid #FFD700",
              borderRadius: "20px",
              padding: "60px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(10px)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Foto de perfil (SEMPRE para teste) */}
            {profileImageData && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    border: "4px solid #FFD700",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#333",
                  }}
                >
{/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/jpeg;base64,${uint8ArrayToBase64(profileImageData)}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt="Profile"
                  />
                </div>
              </div>
            )}

            {/* Conteúdo textual */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: useProfileLayout ? "flex-start" : "center",
                justifyContent: "center",
                flex: 1,
                textAlign: useProfileLayout ? "left" : "center",
              }}
            >
              {/* Nome/Título */}
              <h1
                style={{
                  fontSize: useProfileLayout ? "64px" : "72px",
                  fontWeight: "900",
                  color: "#FFD700",
                  margin: "0 0 16px 0",
                  lineHeight: 1.1,
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {title}
              </h1>

              {/* Subtítulo/Descrição */}
              <p
                style={{
                  fontSize: useProfileLayout ? "32px" : "36px",
                  color: "#FFFFFF",
                  margin: "0 0 24px 0",
                  opacity: 0.9,
                  lineHeight: 1.3,
                  fontWeight: "400",
                }}
              >
                {finalSubtitle}
              </p>

              {/* Badge de portfólio (apenas na homepage) */}
              {isHomepage && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    border: "2px solid rgba(255, 215, 0, 0.3)",
                    borderRadius: "30px",
                    padding: "12px 24px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#FFD700",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "24px",
                      color: "#FFD700",
                      fontWeight: "600",
                      letterSpacing: "1px",
                    }}
                  >
                    PROFESSIONAL PORTFOLIO
                  </span>
                </div>
              )}

              {/* Badge de sobre (apenas na página sobre) */}
              {pageType === 'about' && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    border: "2px solid rgba(255, 215, 0, 0.3)",
                    borderRadius: "30px",
                    padding: "12px 24px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#FFD700",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "24px",
                      color: "#FFD700",
                      fontWeight: "600",
                      letterSpacing: "1px",
                    }}
                  >
                    ABOUT ME
                  </span>
                </div>
              )}

              {/* URL do site (apenas na homepage) */}
              {isHomepage && (
                <p
                  style={{
                    fontSize: "20px",
                    color: "rgba(255, 255, 255, 0.6)",
                    margin: "24px 0 0 0",
                    fontFamily: "monospace",
                  }}
                >
                  {config.site.url.replace('https://', '')}
                </p>
              )}
            </div>
          </div>

          {/* Elementos decorativos */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #FFD700, #FFA500)",
              opacity: 0.2,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #FFD700, #FFA500)",
              opacity: 0.15,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    // Error generating OG image
    
    // Fallback para uma imagem simples em caso de erro
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#121212",
            color: "#FFD700",
          }}
        >
          <h1 style={{ fontSize: "60px", fontWeight: "bold" }}>
            Professional Portfolio
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
