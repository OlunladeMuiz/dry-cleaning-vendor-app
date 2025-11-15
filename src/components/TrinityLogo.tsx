import trinityLogoImage from "figma:asset/be4b2a3c4b7ca46c3821be293ac42c82690dc52a.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TrinityLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCleanU?: boolean;
}

export function TrinityLogo({ variant = 'full', size = 'md', className = '', showCleanU = true }: TrinityLogoProps) {
  // Logo height based on size with responsive scaling
  const heightMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80, // Reduced from 96 for better mobile fit
  };

  const height = heightMap[size];

  if (variant === 'icon') {
    // Icon only - just the Trinity logo
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <ImageWithFallback
          src={trinityLogoImage} 
          alt="Trinity University Logo" 
          style={{ 
            height: `${height}px`,
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  }

  if (variant === 'wordmark') {
    // Logo with CleanU branding side by side
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <ImageWithFallback
          src={trinityLogoImage} 
          alt="Trinity University Logo" 
          style={{ 
            height: `${height}px`,
            width: 'auto',
            objectFit: 'contain'
          }}
        />
        {showCleanU && (
          <div className="flex flex-col">
            <span 
              className="font-display leading-none tracking-tight"
              style={{ 
                fontSize: size === 'sm' ? '18px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '40px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CleanU
            </span>
            {size !== 'sm' && (
              <span 
                className="text-gray-600"
                style={{ 
                  fontSize: size === 'md' ? '10px' : size === 'lg' ? '12px' : '14px',
                  marginTop: '2px'
                }}
              >
                Marketplace
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant (default) - logo + CleanU branding
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ImageWithFallback
        src={trinityLogoImage} 
        alt="Trinity University Logo" 
        style={{ 
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain'
        }}
      />
      {showCleanU && (
        <div className="flex flex-col">
          <span 
            className="font-display leading-none tracking-tight"
            style={{ 
              fontSize: size === 'sm' ? '16px' : size === 'md' ? '20px' : size === 'lg' ? '28px' : '36px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CleanU
          </span>
          {size !== 'sm' && (
            <span 
              className="text-gray-600"
              style={{ 
                fontSize: size === 'md' ? '9px' : size === 'lg' ? '11px' : '13px',
                marginTop: '2px'
              }}
            >
              Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  );
}
