import isObject from "lodash.isobject";
import isString from "lodash.isstring";
import { RefObj } from "../types/ref";

/**
 * The ref object's string value, which can be used as a deduplicating key.
 * Returns null if the value does not appear to be a ref object.
 */
export const refKey = (value: any): string | null => {
  if (!isRefObject(value)) {
    return null;
  } else {
    return value["$ref"];
  }
};

/**
 * Checks if the value is an OpenAPI reference object with the key "$ref".
 * @param value The value to check
 */
export const isRefObject = (value: any): value is RefObj => {
  if (!isObject(value)) {
    return false;
  }
  return "$ref" in value && isString(value["$ref"]);
};
