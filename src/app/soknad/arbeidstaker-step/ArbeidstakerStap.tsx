import React from 'react';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';

const ArbeidstakerStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    // const { values, setValues } = useFormikContext<SoknadFormData>();
    // const { locale } = useIntl();

    return (
        <SoknadStep
            id={StepID.ARBEIDSTAKER}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            showSubmitButton={true}>
            ArbeidstakerStep
        </SoknadStep>
    );
};

export default ArbeidstakerStep;
