// @ts-check
'use strict'

const schema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          Name: { type: 'string' },
          Code: { type: 'string' }
        }
      }
    }
  }
}
exports.schema = schema
