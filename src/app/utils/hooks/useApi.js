// hooks/useApi.js

import { useEffect, useState } from "react";
import { makeAuthenticatedRequest } from "../api";

// interface ApiResponse {
//   id: Number;
//   creator: Number;
//   playbook: Number;
//   campaign: null | String;
//   content_group: null | String;
//   content_name: String;
//   content_params: {
//     assests: Object;
//     targets: Object;
//     content_type: String;
//     content_source: String;
//     prompt_overrides: Object;
//     content_source_copy: String;
//     custom_instructions: any;
//     content_source_format: String;
//     content_source_upload_method: String;
//   };
//   components: {
//     fullContent: {
//       meta: {
//         preceedingContent: String;
//         succeedingContent: String;
//       };
//       text: String;
//     };
//   };
// }

const useApi = (method, endpoint, data) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    makeAuthenticatedRequest(method, endpoint, data)
      .then((data) => {
        setResponseData(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [method, endpoint, data]);

  return { responseData, error };
};

export default useApi;
