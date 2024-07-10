// import { NextRequest, NextResponse } from 'next'
import {NextRequest, NextResponse} from "next/server";
// import { ErrorResponse, methodNotAllowed } from './apiResponse'
// import { __DEV__ } from '../../src/utils/const'
const __DEV__ ="development"
import { badRequest } from '@/helpers/apiResponses'
export default class RouteHandler {
  req: NextRequest
  res: NextResponse

  POST!: (req: NextRequest, res: NextResponse) => void | undefined
  GET!: (req: NextRequest, res: NextResponse) => void | undefined
  PATCH!: (req: NextRequest, res: NextResponse) => void | undefined
  DELETE!: (req: NextRequest, res: NextResponse) => void | undefined

  constructor(req: NextRequest, res: NextResponse) {
    this.req = req
    this.res = res
    this.build = this.build.bind(this)
  }

  async handleRoute() {
    const handler = this[this.req.method as 'POST' | 'GET' | 'PATCH' | 'DELETE']
    console.log("--Handler running")
    if (handler) {
        console.log("--Handler found")
      try {
        await handler(this.req, this.res)
      } catch (error: any) {
        __DEV__ && console.error(error)
        return badRequest(this.res, __DEV__ ? error.message : 'Server error')
      }
    } else {
        console.log("-NO-Handler found")
      badRequest(this.res, `${this.req.method} method not allowed`)
    }
  }

  build(
    method: 'POST' | 'GET' | 'PATCH' | 'DELETE',
    handler: (req: NextRequest, res: NextResponse) => void
  ) {
    this[method] = handler
  }
}
