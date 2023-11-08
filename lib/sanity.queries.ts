import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    overview,
    showcaseProjects[]->{
      _type,
      coverImage,
      overview,
      "slug": slug.current,
      tags,
      title,
    },
    title,
  }
`

export const homePageTitleQuery = groq`
  *[_type == "home"][0].title
`

export const pagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    body,
    overview,
    title,
    "slug": slug.current,
  }
`

export const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug][0] {
    _id,
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    "slug": slug.current,
    tags,
    title,
  }
  `

// 一覧取得
// _typeというのはschemas/documentsで定義されている中から、"item"の項目と合致するものを取得する。
export const getItemsQuery = groq`
    *[_type == "item"]
  `
// 詳細取得
// ここではアイテム一覧から、slugが引数と合致する一つを取得し、title,description...と表示に必要な項目を定義している。
export const itemBySlugQuery = groq`
    *[_type == "item" && slug.current == $slug][0] {
      _id,
      title,
      description,
      thumbnailImage,
      imagesGallery,
      category,
      article,
      "slug": slug.current,
    }
  `
export const projectPaths = groq`
  *[_type == "project" && slug.current != null].slug.current
`

export const pagePaths = groq`
  *[_type == "page" && slug.current != null].slug.current
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    footer,
    menuItems[]->{
      _type,
      "slug": slug.current,
      title
    },
    ogImage,
  }
`
