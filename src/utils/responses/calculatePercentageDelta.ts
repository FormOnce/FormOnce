import type { FormResponse, FormViews } from "@prisma/client";

const calculatePercentageDelta = (entries: FormViews[] | FormResponse[]) => {
    const date = new Date();
    let entriesThisWeek = 0;
    let entriesLastWeek = 0;

    entries.forEach((entry) => {
        // check if entry was created in thas last 7 days
        if (
            new Date(entry.createdAt).getTime() >
            date.getTime() - 7 * 24 * 60 * 60 * 1000
        ) {
            entriesThisWeek++;
            // check if entry was created in the last 14 days but not in the last 7 days
        } else if (
            new Date(entry.createdAt).getTime() >
            date.getTime() - 14 * 24 * 60 * 60 * 1000 &&
            new Date(entry.createdAt).getTime() <=
            date.getTime() - 7 * 24 * 60 * 60 * 1000
        ) {
            entriesLastWeek++;
        }
    });

    return Number(
        (((entriesThisWeek - entriesLastWeek) / entriesLastWeek) * 100).toFixed(2)
    );
};

export default calculatePercentageDelta;