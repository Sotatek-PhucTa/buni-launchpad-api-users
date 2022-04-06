/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface VerifyEtherSignatureRequestDto {
  /**
   * The payload is the signer's address actually
   * @example 0xa6f79B60359f141df90A0C745125B131cAAfFD12
   */
  payload: string;

  /**
   * Signature issued by on the payload
   * @example 0x12345...
   */
  signature: string;

  /**
   * signTypedData / sign
   * @example signTypedData
   */
  signType?: string;
}

export interface VerifyEtherSignatureResponseDto {
  /** @example 0xa6f79B60359f141df90A0C745125B131cAAfFD12 */
  address: string;
}

export interface ErrorMessageDto {
  /**
   * This is error code defined by system
   * @example INVALID_PARAMETER
   */
  errorCode: string;

  /**
   * This is the human-readable message returns to client side
   * @example The parameter X has invalid format.
   */
  message: string;

  /**
   * More information about the context of the error. Maybe include strack trace for dev env.
   * @example Something happens when trying to make request to service Y
   */
  description: string;
}

export interface AccessTokenDto {
  /**
   * The access token
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduYXR1cmUiOiI2ODU3NTIxZmFjYmExN2FjODU2NmRiNzJiODhkMmYzZWE0ZWQ5MDQyOTEyMmMwOGRhYzdjNmJjZGVlMDFlYmRlMzgzMzVjNzE5MTY3NDE0OTdjOTBjMTI4NjFjZWI0OTkzZjc5ZTEzZDZhNTRmOGZkZTA0ZDgyYjg3OTJlZWM4NDFiIiwiYWRkcmVzcyI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImlhdCI6MTYzMjM4NjMxNSwiZXhwIjoxNjM0OTUzMTE1fQ.rJxbHVbZB4pvkwPIuDdJswlBwMAK50D
   */
  access_token: string;
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === 'object' && property !== null
          ? JSON.stringify(property)
          : `${property}`,
      );
      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = (format && this.format) || void 0;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      requestParams.headers.common = { Accept: '*/*' };
      requestParams.headers.post = {};
      requestParams.headers.put = {};

      body = this.createFormData(body as Record<string, unknown>);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Bunicorn Authentication Service
 * @version 1.0.0
 * @contact
 *
 * The service to perform authentication and authorization for Bunicorn game
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerHealth
   * @request GET:/api/auth
   * @response `200` `void`
   */
  appControllerHealth = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/auth`,
      method: 'GET',
      ...params,
    });

  auth = {
    /**
     * @description Verify the signature to authenticate an address
     *
     * @tags orders
     * @name VerifyEtherSignature
     * @summary Verify the signature
     * @request POST:/api/auth/auth/verify-ethers-signature
     * @response `200` `VerifyEtherSignatureResponseDto` Successful case
     * @response `400` `ErrorMessageDto` The address has wrong format, or signature is invalid
     */
    verifyEtherSignature: (data: VerifyEtherSignatureRequestDto, params: RequestParams = {}) =>
      this.request<VerifyEtherSignatureResponseDto, ErrorMessageDto>({
        path: `/api/auth/auth/verify-ethers-signature`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Create access token by address and signature
     *
     * @tags orders
     * @name CreateAccessToken
     * @summary create access token
     * @request POST:/api/auth/auth/tokens
     * @response `200` `AccessTokenDto` Successful case
     * @response `400` `ErrorMessageDto` The address has wrong format, or signature is invalid
     */
    createAccessToken: (data: VerifyEtherSignatureRequestDto, params: RequestParams = {}) =>
      this.request<AccessTokenDto, ErrorMessageDto>({
        path: `/api/auth/auth/tokens`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
}
