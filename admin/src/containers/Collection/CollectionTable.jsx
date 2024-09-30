import React, { memo, useEffect, useState } from 'react'
import { Box, Button, Table, Tbody } from '@strapi/design-system'
import CollectionTableHeader from './CollectionTableHeader'
import CollectionColumn from './CollectionColumn'
import useCollection from '../../Hooks/useCollection'
import pluginId from '../../pluginId'
import { useI18n } from '../../Hooks/useI18n'
import { useFetchClient } from '@strapi/admin/strapi-admin'

const Collection = () => {
  const {
    collections,
    deleteCollection,
    addCollection,
    updateCollection,
    reloadNeeded,
    refetchCollection,
  } = useCollection()
// TODO
//   const { lockAppWithAutoreload, unlockAppWithAutoreload } =
//     useAutoReloadOverlayBlocker()
  const [reload, setReload] = useState(false)

  const { i18n } = useI18n()

  const ROW_COUNT = 6
  const COL_COUNT = 10

  /**
   * Reload the servers and wait for the server to be reloaded.
   */
  const reloadServer = async () => {
    try {
	// TODO
    //   lockAppWithAutoreload()
      await useFetchClient(
        `/${pluginId}/reload`,
        {
          method: 'GET',
        },
        true,
      )
      setReload(false)
    } catch (err) {
      console.error(err)
    } finally {
	// TODO
    //   unlockAppWithAutoreload()
      refetchCollection()
    }
  }

  useEffect(() => {
    if (reload) reloadServer()
  }, [reload])
  return (
    <Box background="neutral100">
      <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
        <CollectionTableHeader />
        <Tbody>
          {collections.map(collection => (
            <CollectionColumn
              key={collection.collection}
              entry={collection}
              deleteCollection={deleteCollection}
              addCollection={addCollection}
              updateCollection={updateCollection}
            />
          ))}
        </Tbody>
      </Table>
      {reloadNeeded && (
        <Box padding={5}>
          <Button onClick={() => setReload(true)}>
            {i18n('plugin.reload-server', 'Reload server')}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default memo(Collection)
