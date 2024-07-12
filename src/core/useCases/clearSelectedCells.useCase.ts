import {
    IExternalMessageProvider,
    IIsncsciAppStoreProvider,
} from '@core/boundaries';
import { BinaryObservation, Cell, MotorLevel } from '@core/domain';
import {
    getExamDataFromGridModel,
} from '@core/helpers/examData.helper';

/*
 * 1. Set selected cells' values to empty strings to clear them
 * 2. Clear the totals in the appStore
 * 3. Retrieve the updated exam data from grid model
 * 4. Send updated exam data to external listeners
 */
export const clearSelectedCellsUseCase = async (
    selectedCells: Cell[],
    gridModel: Array<Cell | null>[],
    vac: BinaryObservation | null,
    dap: BinaryObservation | null,
    rightLowestNonKeyMuscle: MotorLevel | null,
    leftLowestNonKeyMuscle: MotorLevel | null,
    comments: string,
    appStoreProvider: IIsncsciAppStoreProvider,
    externalMessageProvider: IExternalMessageProvider,
) => {
    try {
        // 1. Set selected cells' values to empty strings to clear them
        await appStoreProvider.setCellsValue(
            selectedCells,
            '',
            '',
            null,
            null,
            '',
            '',
        );

        // 2. Clear the totals in the appStore
        await appStoreProvider.clearTotalsAndErrors();

        // 3. Retrieve the updated exam data from grid model
        const { examData } = getExamDataFromGridModel(
            gridModel,
            vac,
            dap,
            rightLowestNonKeyMuscle,
            leftLowestNonKeyMuscle,
            comments,
        );

        // 4. Send updated exam data to external listeners
        await externalMessageProvider.sendOutExamData(examData);
    } catch (error) {
        console.error(`Error clearing cells' values`, error);
    }
};