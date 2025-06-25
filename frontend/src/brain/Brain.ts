import {
  CheckHealthData,
  GetAnalyticsData,
  GetCompanyProfileData,
  GetCompanyProfileError,
  GetCompanyProfileParams,
  GetProductData,
  GetProductError,
  GetProductParams,
  ListProductsData,
  ListProductsError,
  ListProductsParams,
  ListReviewsForProductData,
  ListReviewsForProductError,
  ListReviewsForProductParams,
  RegisterUserData,
  RegisterUserError,
  RegistrationRequest,
  ReviewRequest,
  SearchCompaniesData,
  SearchCompaniesError,
  SearchCompaniesParams,
  SubmitReviewData,
  SubmitReviewError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:users, dbtn/hasAuth
   * @name register_user
   * @summary Register User
   * @request POST:/routes/register
   */
  register_user = (data: RegistrationRequest, params: RequestParams = {}) =>
    this.request<RegisterUserData, RegisterUserError>({
      path: `/routes/register`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags products, dbtn/module:products, dbtn/hasAuth
   * @name list_products
   * @summary List Products
   * @request GET:/routes/products/
   */
  list_products = (query: ListProductsParams, params: RequestParams = {}) =>
    this.request<ListProductsData, ListProductsError>({
      path: `/routes/products/`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags products, dbtn/module:products, dbtn/hasAuth
   * @name get_product
   * @summary Get Product
   * @request GET:/routes/products/{product_id}
   */
  get_product = ({ productId, ...query }: GetProductParams, params: RequestParams = {}) =>
    this.request<GetProductData, GetProductError>({
      path: `/routes/products/${productId}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags reviews, dbtn/module:reviews, dbtn/hasAuth
   * @name list_reviews_for_product
   * @summary List Reviews For Product
   * @request GET:/routes/reviews/{product_id}
   */
  list_reviews_for_product = ({ productId, ...query }: ListReviewsForProductParams, params: RequestParams = {}) =>
    this.request<ListReviewsForProductData, ListReviewsForProductError>({
      path: `/routes/reviews/${productId}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags reviews, dbtn/module:reviews, dbtn/hasAuth
   * @name submit_review
   * @summary Submit Review
   * @request POST:/routes/reviews/
   */
  submit_review = (data: ReviewRequest, params: RequestParams = {}) =>
    this.request<SubmitReviewData, SubmitReviewError>({
      path: `/routes/reviews/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags companies, dbtn/module:companies, dbtn/hasAuth
   * @name search_companies
   * @summary Search Companies
   * @request GET:/routes/companies/
   */
  search_companies = (query: SearchCompaniesParams, params: RequestParams = {}) =>
    this.request<SearchCompaniesData, SearchCompaniesError>({
      path: `/routes/companies/`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags companies, dbtn/module:companies, dbtn/hasAuth
   * @name get_company_profile
   * @summary Get Company Profile
   * @request GET:/routes/companies/{company_id}
   */
  get_company_profile = ({ companyId, ...query }: GetCompanyProfileParams, params: RequestParams = {}) =>
    this.request<GetCompanyProfileData, GetCompanyProfileError>({
      path: `/routes/companies/${companyId}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dashboard, dbtn/module:dashboard, dbtn/hasAuth
   * @name get_analytics
   * @summary Get Analytics
   * @request GET:/routes/dashboard/analytics
   */
  get_analytics = (params: RequestParams = {}) =>
    this.request<GetAnalyticsData, any>({
      path: `/routes/dashboard/analytics`,
      method: "GET",
      ...params,
    });
}
