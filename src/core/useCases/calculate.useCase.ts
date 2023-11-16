import {
  IExternalMessageProvider,
  IIsncsciAppStoreProvider,
  IIsncsciExamProvider,
} from '@core/boundaries';
import {Cell} from '@core/domain';
import {getExamDataFromGridModel, validateExamData} from '@core/helpers';

export const calculateUseCase = (
  appStoreProvider: IIsncsciAppStoreProvider,
  examProvider: IIsncsciExamProvider,
  externalMessageProvider: IExternalMessageProvider,
  gridModel: Array<Cell | null>[],
) => {
  // 1. Get exam data from grid model
  const {examData, isMissingValues} = getExamDataFromGridModel(gridModel);

  // [ToDo: Remove this]
  // We are adding the following lines as that part is missing in the implementation
  // As the input controls are not available yet
  console.log(
    'Do not forget to remove DAP and GAP setting in calculate.useCase.ts',
  );
  examData.deepAnalPressure = 'Yes';
  examData.voluntaryAnalContraction = 'Yes';

  // 2. Validate exam data
  if (isMissingValues) {
    throw new Error(`Missing values`);
  }

  const errors = validateExamData(examData);

  if (errors.length > 0) {
    throw new Error(`The exam is not complete`);
  }

  // 3. Calculate totals
  examProvider.calculate(examData).then((totals) => {
    // 4. Bind totals to exam data
    Object.keys(totals).forEach((key) => {
      examData[key] = totals[key];
    });

    // Update external listeners
    externalMessageProvider.sendOutExamData(examData);

    // 5. Update state
    appStoreProvider.setTotals(totals);
  });
};
