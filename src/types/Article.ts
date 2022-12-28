import {BaseType} from "@/types/BaseType";

/**
 * Created by myd on 2022/12/9
 */
export interface Article extends BaseType {
  title?: string; //标题
  abstract?: string; //摘要
  article?: string | number; //文章随机ID，对应文件名
  categories?: number[]; //分类
  tags?: number[]; //tags
  isDisabled?: boolean;
  isTop?: boolean;
  poster?: string;
}