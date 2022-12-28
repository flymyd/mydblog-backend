import React from "react";
import {FormInstance} from "antd";
import {FreeObject} from "@/types/FreeObject";
import {Gutter} from "antd/es/grid/row";

/**
 * Created by myd on 2022/12/12
 */
export interface BasicFormCell {
  // 字段名
  labelCol?: FreeObject;
  labelAlign?: 'left' | 'right';
  name: string;
  // 标签
  label?: string;
  // 类型
  type: 'select' | 'input' | 'datetime' | 'file' | 'multiSelect' | 'pic';
  // 数据源（下拉选择用）
  dataSource?: Object | Array<any>;
  // 选择器键值对的映射
  selectMap?: { label: string, value: string };
  // 验证
  validate?: Array<any>;
  col?: number;
  // 文件上传个数限制
  fileNumLimit?: number;
  // 文件上传路径
  fileAction?: string;
  // 自定义上传
  fileCustomRequest?: any;
  // 文件上传后的回调
  fileCallback?: any;
}

export interface BasicFormParams {
  // Form实例
  formInstance: FormInstance,
  // 表单名
  formName: string,
  // 搜索栏参数
  elements: BasicFormCell[],
  // 初始值
  initialValues?: Object,
  // 提交表单的动作
  onSubmit?: any,
  // 按钮组是否占单独行
  standAloneButton?: boolean,
  // 显示功能按钮组
  showButtonGroup?: boolean,
  // 表单行内插槽
  inlineSlot?: React.ReactNode,
  // 表单单独一行插槽
  externalSlot?: React.ReactNode,
  //提交后是否重置
  resetAfterSubmit?: boolean,
  gutter?: Gutter | [Gutter, Gutter];
}