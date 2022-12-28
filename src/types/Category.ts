import {BaseType} from "@/types/BaseType";

/**
 * Created by myd on 2022/12/9
 */
export interface Category extends BaseType{
  name?: string;
  articles?: number[];
}