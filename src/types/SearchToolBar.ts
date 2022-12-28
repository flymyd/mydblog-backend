import {BasicFormCell} from "@/types/BasicForm";

/**
 * Created by myd on 2022/12/12
 */
export type SearchToolBarParams = {
  standAloneButton?: boolean,
  onSearch?: Function,
  elements: BasicFormCell[],
  initialValues?: Object,
};