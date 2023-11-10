/**
 * This plugin contains all the logic for setting up the singletons
 */

import { type DocumentDefinition } from 'sanity'
import { type StructureResolver } from 'sanity/desk'
import { Iframe } from 'sanity-plugin-iframe-pane'

import { iframeOptions, PREVIEWABLE_DOCUMENT_TYPES } from '../sanity.config'

export const singletonPlugin = (types: string[]) => {
  return {
    name: 'singletonPlugin',
    document: {
      // Hide 'Singletons (such as Home)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (prev, { creationContext }) => {
        if (creationContext.type === 'global') {
          return prev.filter(
            (templateItem) => !types.includes(templateItem.templateId),
          )
        }

        return prev
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== 'duplicate')
        }

        return prev
      },
    },
  }
}

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// like how "Home" is handled.
export const pageStructure = (
  typeDefArray: DocumentDefinition[],
): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Desktool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name)
            .views([
              // Default form view
              S.view.form(),
              // Preview
              ...(PREVIEWABLE_DOCUMENT_TYPES.includes(typeDef.name as any)
                ? [
                    S.view
                      .component(Iframe)
                      .options(iframeOptions)
                      .title('Preview'),
                  ]
                : []),
            ]),
        )
    })

    // The default root list items (except custom ones)
    const defaultListItems = S.documentTypeListItems()
      .filter(
        (listItem) =>
          !typeDefArray.find(
            (singleton) => singleton.name === listItem.getId(),
          ),
      )
      .filter(
        (listItem) =>
          listItem.getId() === 'item' || listItem.getId() === 'collection',
      )

    // ここで管理画面のサイドナビで表示するものを変更する。
    return S.list()
      .title('Content')
      .items([
        ...singletonItems,
        S.divider(),
        ...defaultListItems,
        S.listItem()
          .title('Products')
          .schemaType('product')
          .child(
            S.documentTypeList('product')
              // .defaultLayout('detail')
              .child(async (id) =>
                S.list()
                  .title('Product')
                  .canHandleIntent(
                    (intentName, params) =>
                      intentName === 'edit' && params.type === 'product',
                  )
                  .items([
                    // Details
                    S.listItem()
                      .title('Details')
                      .schemaType('product')
                      .id(id)
                      .child(S.document().schemaType('product').documentId(id)),
                    // Product variants
                    S.listItem()
                      .title('Variants')
                      .schemaType('productVariant')
                      .child(
                        S.documentList()
                          .title('Variants')
                          .schemaType('productVariant')
                          .filter(
                            `
                          _type == "productVariant"
                          && store.productId == $productId
                        `,
                          )
                          .params({
                            productId: Number(
                              id.replace('shopifyProduct-', ''),
                            ),
                          })
                          .canHandleIntent(
                            (intentName, params) =>
                              intentName === 'edit' &&
                              params.type === 'productVariant',
                          ),
                      ),
                  ]),
              ),
          ),
      ])
  }
}
