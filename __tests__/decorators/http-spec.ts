// import * as express from 'express';
// tslint:disable-next-line:no-duplicate-imports

import Aex from "../../src/core";
import { http } from "../../src/decorators/http";

import { GetText, PostText, initRandomPort } from "../../src/util/request";

class Exam {
  @http("", "/notstring/:name")
  public notstring(_req: any, res: any, _scope: any) {
    res.end("Hello Aex!");
  }

  @http("aa", "/wrong/:name")
  public wrong(_req: any, res: any, _scope: any) {
    res.end("Hello Aex!");
  }

  @http("get", "/user/:name")
  public hello(_req: any, res: any, _scope: any) {
    res.end("Hello Aex!");
  }

  @http(["get", "post", "aaa"], "/user/login")
  public login(_req: any, res: any, _scope: any) {
    res.end("User Login!");
  }

  @http(["get", "post"], ["/", "/home"])
  public home(_req: any, res: any, _scope: any) {
    res.end("User Home!");
  }

  @http("*", "/user/all")
  public all(_req: any, res: any, _scope: any) {
    res.end("User All!");
  }

  @http("*", "/user/null")
  public no(_req: any, res: any, _scope: any) {
    res.end();
  }
}

const aex = new Aex();
aex.prepare();

let port: number = 0;

beforeAll(async () => {
  port = await initRandomPort(aex);
  const exam = new Exam();
  expect(exam).toBeTruthy();
});

test("Should decorate methods with single http method name", async () => {
  await GetText(port, "Hello Aex!", "/user/aoaoa");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Login!", "/user/login");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Login!", "/user/login", "localhost");
});

test("Should decorate methods with array", async () => {
  await GetText(port, "User Login!", "/user/login", "localhost", {
    headers: { "Set-Cookie": "aa=a100" },
  });
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Login!", "/user/login", "localhost", "POST");
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Login!", "/user/login", "localhost");
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Login!", "/user/login");
});

test("Should decorate methods with array", async () => {
  await PostText(port, {}, "User Home!");
});

test("Should decorate methods with all methods", async () => {
  await GetText(port, "User All!", "/user/all");
});

test("Should decorate methods with all methods", async () => {
  await GetText(port, "", "/user/null");
});


afterAll(async () => {
  aex.server?.close();
});