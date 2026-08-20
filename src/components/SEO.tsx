import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
  structuredData?: Record<string, unknown>
}

const SITE_URL = 'https://venkysfoods.in'

export default function SEO({ title, description, path = '/', image, structuredData }: SEOProps) {
  const fullTitle = title.includes("Venky's") ? title : `${title} | Venky's`
  const url = `${SITE_URL}${path}`
  const ogImage = image ?? `${SITE_URL}/images/og-cover.jpg`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  )
}
