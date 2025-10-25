// @types/fastify.d.ts

declare module 'fastify' {
  export interface FastifyRequest {
    multipart: {
      file: {
        filename: string | null
        mimetype: string | null
        tempPath: string | null
      }
      body: Record<string, any>
    }
  }
}

export {}
