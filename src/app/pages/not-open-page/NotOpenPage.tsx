import React from 'react';
import ErrorPage from '../../components/error-page/ErrorPage';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import { Ingress } from 'nav-frontend-typografi';

const NotOpenPage: React.StatelessComponent<{}> = () => {
    return (
        <ErrorPage pageTitle="Søknaden er ikke tilgjengelig">
            <ErrorGuide title="Søknaden er ikke tilgjengelig" stillHappy={false}>
                <Ingress tag="div">
                    Ordningen opphørte 30. september 2021, men det er lagt frem forslag om at ordningen skal forlenges
                    ut 2021. Vi oppdaterer informasjonen på denne siden når Stortinget har vurdert forslaget og fattet
                    et nytt vedtak for ordningen.
                </Ingress>
            </ErrorGuide>
        </ErrorPage>
    );
};

export default NotOpenPage;
