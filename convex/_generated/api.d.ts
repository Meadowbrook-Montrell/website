/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ViktorSpacesEmail from "../ViktorSpacesEmail.js";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as businessOps from "../businessOps.js";
import type * as commandCenter from "../commandCenter.js";
import type * as constants from "../constants.js";
import type * as consumer from "../consumer.js";
import type * as contentLib from "../contentLib.js";
import type * as emailService from "../emailService.js";
import type * as features2 from "../features2.js";
import type * as http from "../http.js";
import type * as operations from "../operations.js";
import type * as phase4 from "../phase4.js";
import type * as powerups from "../powerups.js";
import type * as seedTestUser from "../seedTestUser.js";
import type * as testAuth from "../testAuth.js";
import type * as users from "../users.js";
import type * as viktorTools from "../viktorTools.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ViktorSpacesEmail: typeof ViktorSpacesEmail;
  admin: typeof admin;
  auth: typeof auth;
  businessOps: typeof businessOps;
  commandCenter: typeof commandCenter;
  constants: typeof constants;
  consumer: typeof consumer;
  contentLib: typeof contentLib;
  emailService: typeof emailService;
  features2: typeof features2;
  http: typeof http;
  operations: typeof operations;
  phase4: typeof phase4;
  powerups: typeof powerups;
  seedTestUser: typeof seedTestUser;
  testAuth: typeof testAuth;
  users: typeof users;
  viktorTools: typeof viktorTools;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
