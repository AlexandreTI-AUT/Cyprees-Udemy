/// <reference types="cypress"/>

describe('Work with basic locators', () => {
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')

    })

    beforeEach(() => {
        cy.reload()
    })
    it('Using Jquery selector',() =>{
        cy.get(':nth-child(1) > :nth-child(3) > [type="button"]')
        cy.get("[onclick*='Francisco']")

    })
    it('Using xpath', () => {
        cy.xpath('//input')

    })
})