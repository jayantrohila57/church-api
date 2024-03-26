import { SwaggerDefinition } from 'swagger-jsdoc'

import { swagger } from '../../core/config/config'
import { UserDocs } from '../users/user.docs'

export const config: SwaggerDefinition = {
  ...swagger,
  paths: { ...UserDocs.paths },
}
