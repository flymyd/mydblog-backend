import React from "react";
import {BasicFormCell} from "@/types/BasicForm";
import {Gutter} from "antd/es/grid/row";

/**
 * Created by myd on 2022/12/12
 */
export type EditModalParams = {
  gutter?: Gutter | [Gutter, Gutter];
  children?: React.ReactNode,
  title?: string,
  onSubmit?: any,
  elements: BasicFormCell[],
  centered?: boolean,
  initialValues?: any
}