import { createHash } from "crypto";
import { cloneDeep } from "lodash";
import traverse = require("traverse");

// const { createHash } = require("crypto");
// const { cloneDeep } = require("lodash");
// const traverse = require("traverse");

const PIIFields = [
  "phonenumber",
  "mdn",
  "mobileequipmentid",
  "personalized_name",
  "mobile_equipment_identifier",
  "mobile_device_nbr",
  "identification",
  "customeridentifier",
  "customerid", // Onboarding CRM's responses puts MDN data in this field
  "mdntext",
  "firstName",
  "lastName",
  "identifier"
];

/**
 * A message serializer. returns a stripped down object for logging
 *  with any PII data removed
 *
 *  This method searches for PII data keys in a object.
 *  Replaces the values with hash
 *  Traverse package is used to do nested search and replace
 */
export function maskPII(obj) {
  if (!obj) {
    return obj;
  }
  const newObj = cloneDeep(obj);
  traverse(newObj).forEach(function(x) {
    if (this.key === "body" && typeof x === "string") {
      try {
        this.update(JSON.parse(x));
      } catch (e) {
        /* tslint:disable */
        console.log("warn", "JSON parsing failed in logger for mask PII");
        /* tslint:enable */
      }
    }
    if (
      this.key &&
      PIIFields.includes(this.key.toLowerCase()) &&
      x &&
      typeof x === "string"
    ) {
      this.update(
        `sha256<${createHash("sha256")
          .update(x)
          .digest("hex")}>`
      );
    }
  });
  return newObj;
}

// module.exports = maskPII;
