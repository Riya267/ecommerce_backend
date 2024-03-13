import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'

import path from 'path'

const types = loadFilesSync(path.join(__dirname, 'graphql/**/*.gql'))

export default mergeTypeDefs(types)
