import {
  CheckHealthData,
  GetAnalyticsData,
  GetCompanyProfileData,
  GetProductData,
  ListProductsData,
  ListReviewsForProductData,
  RegisterUserData,
  RegistrationRequest,
  ReviewRequest,
  SearchCompaniesData,
  SubmitReviewData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * No description
   * @tags dbtn/module:users, dbtn/hasAuth
   * @name register_user
   * @summary Register User
   * @request POST:/routes/register
   */
  export namespace register_user {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegistrationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterUserData;
  }

  /**
   * No description
   * @tags products, dbtn/module:products, dbtn/hasAuth
   * @name list_products
   * @summary List Products
   * @request GET:/routes/products/
   */
  export namespace list_products {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Category
       * Filter by category name
       */
      category?: string;
      /**
       * Brand
       * Filter by brand name
       */
      brand?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListProductsData;
  }

  /**
   * No description
   * @tags products, dbtn/module:products, dbtn/hasAuth
   * @name get_product
   * @summary Get Product
   * @request GET:/routes/products/{product_id}
   */
  export namespace get_product {
    export type RequestParams = {
      /** Product Id */
      productId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetProductData;
  }

  /**
   * No description
   * @tags reviews, dbtn/module:reviews, dbtn/hasAuth
   * @name list_reviews_for_product
   * @summary List Reviews For Product
   * @request GET:/routes/reviews/{product_id}
   */
  export namespace list_reviews_for_product {
    export type RequestParams = {
      /** Product Id */
      productId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListReviewsForProductData;
  }

  /**
   * No description
   * @tags reviews, dbtn/module:reviews, dbtn/hasAuth
   * @name submit_review
   * @summary Submit Review
   * @request POST:/routes/reviews/
   */
  export namespace submit_review {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ReviewRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SubmitReviewData;
  }

  /**
   * No description
   * @tags companies, dbtn/module:companies, dbtn/hasAuth
   * @name search_companies
   * @summary Search Companies
   * @request GET:/routes/companies/
   */
  export namespace search_companies {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * State
       * Filter by state (e.g., 'SP')
       */
      state?: string;
      /**
       * City
       * Filter by city
       */
      city?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SearchCompaniesData;
  }

  /**
   * No description
   * @tags companies, dbtn/module:companies, dbtn/hasAuth
   * @name get_company_profile
   * @summary Get Company Profile
   * @request GET:/routes/companies/{company_id}
   */
  export namespace get_company_profile {
    export type RequestParams = {
      /** Company Id */
      companyId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCompanyProfileData;
  }

  /**
   * No description
   * @tags dashboard, dbtn/module:dashboard, dbtn/hasAuth
   * @name get_analytics
   * @summary Get Analytics
   * @request GET:/routes/dashboard/analytics
   */
  export namespace get_analytics {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAnalyticsData;
  }
}
