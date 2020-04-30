import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormikYesOrNoQuestion, {
    FormikYesOrNoQuestionProps,
} from '@navikt/sif-common-formik/lib/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { SoknadFormField } from '../types/SoknadFormData';
import QuestionVisibilityBlock from '../components/question-visibility-block/QuestionVisibilityBlock';
import { soknadQuestionText } from './soknadQuestionText';
import StopMessage from '../components/stop-message/StopMessage';
import InfoMessage from '../components/info-message/InfoMessage';
import { BoxMargin } from '@navikt/sif-common-core/lib/components/box/Box';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';

interface Props extends FormikYesOrNoQuestionProps<SoknadFormField> {
    showStop?: boolean;
    description?: React.ReactNode;
    stopMessage?: React.ReactNode;
    infoMessage?: React.ReactNode;
    showInfo?: boolean;
    legend?: React.ReactNode;
    children?: React.ReactNode;
    margin?: BoxMargin;
}

const SoknadQuestion = ({
    name,
    showStop,
    description,
    stopMessage,
    showInfo,
    infoMessage,
    legend,
    children,
    margin,
}: Props) => {
    return (
        <QuestionVisibilityBlock<SoknadFormField> fieldName={name}>
            <FormBlock margin={margin}>
                {children || (
                    <FormikYesOrNoQuestion
                        name={name}
                        legend={legend || soknadQuestionText[name]}
                        description={description}
                        validate={validateYesOrNoIsAnswered}
                    />
                )}
                {showStop && stopMessage && <StopMessage>{stopMessage}</StopMessage>}
                {showInfo && infoMessage && <InfoMessage>{infoMessage}</InfoMessage>}
            </FormBlock>
        </QuestionVisibilityBlock>
    );
};

export default SoknadQuestion;
