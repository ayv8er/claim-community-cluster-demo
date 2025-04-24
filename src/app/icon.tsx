import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const localPort = process.env.PORT || '3000';
const localBaseUrl = `http://localhost:${localPort}`;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || localBaseUrl;

export default function Icon() {
  const imageUrl = `${baseUrl}/notwrjo.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
          src={imageUrl}
          alt="Notwrjo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  )
}