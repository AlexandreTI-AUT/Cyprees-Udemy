/// <reference types="cypress"/>




describe('Should test at a functional level', () => {
    let token
    before(() => {
        cy.getToken('alexix.dasilva@gmail.com', '308349')
           .then(tkn => {
               token = tkn
           })
              
    })

    beforeEach(() => {
        cy.resetRest()
        
    })

    it('Should create an account', () => {
    
        cy.request({
            url: '/contas',
            method:'POST',
            headers: { Authorization: `JWT ${token}`},
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')
    
    cy.get('@response').then(res => {
        expect(res.status).to.be.equal(201)
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('nome', 'Conta via rest')

    })
})
  
        
    

    it('Should update an account', () => {
        cy.request({ 
            method: 'GET',
            url: '/contas',
            headers: { Authorization: `JWT ${token}`},
            qs: {
                nome: 'Conta para alterar'
            }
 
        }).then(res => {
            cy.request({ 
                url: `/contas/${res.body[0].id}`,
                method: 'PUT',
                headers: { Authorization: `JWT ${token}`},
                body: {
                    nome: 'conta alterada via rest'
                }

        }).as('response')
    

    })
        cy.get('@response').its('status').should('be.equal', 200)
      


    })
    
    it('Should not creat an account same name ', () => {
        cy.request({
            url: '/contas',
            method:'POST',
            headers: { Authorization: `JWT ${token}`},
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')
    
    cy.get('@response').then(res => {
        expect(res.status).to.be.equal(400)
        expect(res.body.error).to.have.equal('Já existe uma conta com esse nome!')

    })
      

    })

    it('Should create a transaction', () => {
        cy.getContasByName('Conta para movimentacoes')
        .then(contaID => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                headers: { Authorization: `JWT ${token}`},
                body: {
                    conta_id: contaID,
                    data_pagamento: Cypress.moment().add({days: 1}).format('DD/MM/YYYY'),
                    data_transacao: Cypress.moment().format('DD/MM/YYYY'),
                    descricao: "desc",
                    envolvido: "inter",
                    status: true,
                    tipo: "REC",
                    valor: "123"
    
                }
            }).as('response')

        })
        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
                    
    })

    it('Should get balance', () => {
        cy.request({
            url: '/saldo',
            method: 'GET',
            headers: { Authorization: `JWT ${token}` }
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if (c.conta === 'Conta para saldo') saldoConta = c.saldo

            })
            expect(saldoConta).to.be.equal('534.00')
        })
      

    })

    it('Should remove a transaction', () =>{
        cy.request({
            method: 'GET',
            url: '/transacoes',
            // headers: { Authorization: `JWT ${token}` },
            qs: { descricao: 'Movimentacao para exclusao'}
        }).then(res => {
            cy.request({
                url: `/transacoes/${res.body[0].id } `,
                method: 'DELETE',
                // headers: { Authorization: `JWT ${token}` },
            }).its('status').should('be.equal', 204)
          
        })
      
    })

})