import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";


/** Index
 * getAll: protectedProcedure - get all forms for a workspace
 **/

export const formRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                return await
                    ctx.prisma.form.findMany({
                        where: {
                            workspaceId: ctx.session?.user?.workspaceId
                        },
                        include: {
                            author: {
                                select: {
                                    name: true,
                                    email: true,
                                    id: true
                                }
                            },
                        }
                    });
            } catch (error) {
                console.log(error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong",
                });
            }

        }),
});
