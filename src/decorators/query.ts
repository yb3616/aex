/**
 * aex
 * Copyright(c) 2020- calidion<calidion@gmail.com>
 * MIT Licensed
 */
import * as qs from "querystring";
import { Scope } from "../scope";

export function query() {
  // tslint:disable-next-line: only-arrow-functions
  return function (
    _target: any,
    // tslint:disable-next-line: variable-name
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin = descriptor.value;

    // tslint:disable-next-line: only-arrow-functions
    descriptor.value = async function (...args: any[]) {
      const req = args[0];

      let splited: any = req.url as string;
      splited = splited.split("?");
      if (splited.length > 1) {
        req.query = qs.parse(splited[1]);
      }
      const scope: Scope = args[2];
      Object.assign(scope.query, req.query);
      await origin.apply(this, args);
    };
    return descriptor;
  };
}
