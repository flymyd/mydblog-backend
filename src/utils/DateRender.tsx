import React from "react";

export const dateRender = (dateString: string) => {
  const date = new Date(dateString).toLocaleString('zh-Hans-CN');
  return <span>{date}</span>
}