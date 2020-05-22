/**
 * Just like cy.get() but will return element specified with 'data-test=' attribute.
 *
 * @example cy.getTestElement('my-fancy-attr-name')
 * 
 * How to get select element
 * <Select data-test="@send/fee-select" />
 *  - getTestElement('@send/fee-select/input') will get input
 *  - getTestElement('@send/fee-select/option/bla') will get option by it's label
 */


export const getTestElement = (selector: string, options?: Parameters<typeof cy.get>[1]) => {
    return cy.get(`[data-test="${selector}"]`, options);
};

export const getConfirmActionOnDeviceModal = () => {
    return cy.getTestElement('@suite/modal/confirm-action-on-device');
};
