import React from 'react';
import { StepConfigProps, StepID } from '../stepConfig';
import ApplicationStep from '../ApplicationStep';

const WelcomeStep = ({ onValidSubmit }: StepConfigProps) => {
    return (
        <ApplicationStep id={StepID.WELCOME} onValidFormSubmit={onValidSubmit}>
            Welcome
        </ApplicationStep>
    );
};

export default WelcomeStep;
