import { ApplicantData } from '../../types/ApplicantData';
import { AccessRule, AccessRuleNames, AccessRuleResult } from '../../types/AccessRule';
import { getAgeFromFødselsnummer } from '../getAgeFromFødselsnummer';

const MIN_AGE = 18;
const MAX_AGE = 67;

const passesAgeTest = (age: number) => age >= MIN_AGE && age <= MAX_AGE;

async function verifyAge(age: number): Promise<AccessRuleResult> {
    const passes: boolean = passesAgeTest(age);
    return {
        rule: AccessRuleNames.gyldigAlder,
        passes,
        info: `Users age is ${age}`,
    };
}

export const ageRule = (applicant: ApplicantData): AccessRule => {
    return {
        name: AccessRuleNames.gyldigAlder,
        check: () => verifyAge(getAgeFromFødselsnummer(applicant.person.fødselsnummer)),
    };
};
