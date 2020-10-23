const TYPE = 'type';
const ADVICE_CONFIRM = 'advice-confirm';
const PROJECT = 'advice-project';
const ADVICE_WITH_PROJECT_USER = 'advice-with-project-user';
const ADVICE_WITHOUT_PROJECT_USER = 'advice-without-project-user';
const RECEIVE_MORE_INTERESTS = 'receive-more-interests';
const RECEIVE_MORE_USER = 'receive-more-user';

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    handleCurrentStep();

    function handleCurrentStep() {
        const stepActive = document.querySelector('.step.active'); 
        const stepActiveName = stepActive.dataset.step;
        const nextBtn = document.querySelector('.step.active .next');
        const backBtn = document.querySelector('.step.active .back');

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                let nextClass;
                if (stepActiveName === TYPE || stepActiveName === ADVICE_CONFIRM) {
                    const radioActive = document.querySelector(`.step.active input[name="${stepActiveName}"]:checked`);
                    if (!radioActive) return;
                    nextClass = radioActive.value;
                } else {
                    nextClass = this.dataset.next;
                }
                gotoStep(stepActive, nextClass);
            });
        }

        if (backBtn) {
            const prevStepClass = backBtn.dataset.back;
            if (!prevStepClass) return;

            backBtn.addEventListener('click', function() {
                gotoStep(stepActive, prevStepClass);
            });
        }
    }

    function gotoStep(currentStep, className) {
        currentStep.classList.remove('active');
        document.getElementsByClassName(className)[0].classList.add('active');
        handleCurrentStep();
    }
});