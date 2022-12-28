import {Article} from "@/types/Article";
import {BaseType} from "./BaseType";

/**
 * Created by myd on 2022/12/9
 */
export interface Tag extends BaseType {
  name?: string;
  articles?: Article[];
}