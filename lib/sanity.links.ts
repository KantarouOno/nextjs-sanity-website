// このページはプレビューの為のURLを作成する実装である。

export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : undefined
    // ここで追加することでitem詳細をプレヴューするpagePathが作成される。
    case 'item':
      return slug ? `/items/${slug}` : undefined
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}
