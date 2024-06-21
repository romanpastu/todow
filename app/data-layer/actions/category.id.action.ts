import { json, redirect } from "@remix-run/react";
import { CATEGORY_ID_ACTIONS } from "~/constants/loader-actions/category-id-actions";
import { db } from "~/utils/db.server";

export const action = async ({ request, params }: { request: Request, params : {
    categoryId: string;
  } }) => {
    const formData = await request.formData();
    const actionType = formData.get("actionType") as string;
    const categoryId = formData.get("categoryId") as string;
    if (actionType === CATEGORY_ID_ACTIONS.DELETE_CATEGORY) {
      await db.category.delete({ where: { id: +categoryId } });
      return redirect("/");
    }else if(actionType === CATEGORY_ID_ACTIONS.EDIT_CATEGORY) {
      
      const title = formData.get("title") as string;
      const { categoryId } = params;
      await db.category.update({
        where: { id: +categoryId },
        data: {
          title,
        },
      });
  
      return json({ success: true });
    }
  }