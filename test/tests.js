const express = require("express");
const chai = require("chai");
const should = chai.should();
const expect = require("chai").expect;

const request = require("supertest")("localhost:3000/");
const app = require("../index.js");

describe("POST Create Short URL", () => {
  it("should create new unique short URL", async () => {
    const response = await request.post("api/url/shorten").send({
      longUrl: "https://www.kanlanc.com",
    });

    expect(response.status).to.eql(200);
    expect(response.body.shortUrl).to.be.a("string");
  });

  it("should return error for bad URL", async () => {
    const response = await request.post("api/url/shorten").send({
      longUrl: "kanlanc.com",
    });

    expect(response.status).to.eql(401);
    expect(response.body.message).to.be.eql("Invalid longUrl");
  });
});
