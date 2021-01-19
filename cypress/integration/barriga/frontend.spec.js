/// <reference types="cypress"/>

import loc from '../../support/locators'
import '../../support/commandsContas'
import buildEnv from '../../support/buildEnv'

describe('Should test at a functional level', () => {
    after(() => {
        cy.clearLocalStorage()
    })
  
    beforeEach(() => {
        buildEnv()
        cy.login('a@a', 'senha errada')
        cy.get(loc.MENU.HOME).click()
    })

    it('Should create an account', () => {
      

       cy.route({
        method: 'POST',
        url: '/contas',
        response: [
            {id:3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
            
         ]
    }).as('saveConta')
        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id:1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id:2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id:3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
             ]
        }).as('contasSave')
        cy.inserirConta('Conta de Teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
        
    })

    it('Should update an account', () => {
      
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response: [
                {id:1, nome: 'Conta Alterada', visivel: true, usuario_id: 1},
                
             ]
        })

        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Carteira')).click()
        cy.get(loc.CONTAS.NOME)
        .clear()
        .type('Conta Alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')


    })
    
    it('Should not creat an account same name ', () => {
        cy.route({
        method: 'POST',
        url: '/contas',
        response: 
            {"error": "Já existe uma conta com esse nome!"},
            status: 400
                     
    }).as('saveContasMesmoNome')
        cy.acessarMenuConta()
        cy.get(loc.CONTAS.NOME).type('Conta mesmo nome')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')

    })

    it('Should create a transaction', () => {
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: {"id":340407,"descricao":"eeeee","envolvido":"eeee","observacao":null,"tipo":"REC","data_transacao":"2021-01-12T03:00:00.000Z","data_pagamento":"2021-01-12T03:00:00.000Z","valor":"235.00","status":true,"conta_id":372868,"usuario_id":1,"transferencia_id":null,"parcelamento_id":null}
        })
        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Banco')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
        
    })

    it('Should get balance', () => {
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100,00')

        // cy.get(loc.MENU.EXTRATO).click()
        // cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        // cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        // cy.get(loc.MOVIMENTACAO.STATUS).click()
        // cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        // cy.get(loc.MESSAGE).should('contain', 'sucesso')

        // cy.get(loc.MENU.HOME).click()
        // cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')

    })

    it('Should remove a transaction', () =>{
        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            response:{},
            status: 204,
        }).as('del')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

    })

    it.only('Should validate data send to create an account', () => {
      

        cy.route({
         method: 'POST',
         url: '/contas',
         response:{id:3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
         onRequest: req => {
             console.log(req)
             expect(req.request.body.nome).to.be.empty
         }
             
          
     }).as('saveConta')

         cy.acessarMenuConta()
 
         cy.route({
             method: 'GET',
             url: '/contas',
             response: [
                 {id:1, nome: 'Carteira', visivel: true, usuario_id: 1},
                 {id:2, nome: 'Banco', visivel: true, usuario_id: 1},
                 {id:3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
              ]
         }).as('contasSave')
         cy.inserirConta('{CONTROL}')
        //  cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
         cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
         
     })

     it('Should test the responsiveness', ()=> {
        cy.get('[data-test=menu-home').should('exist')
           .and('be.visible')
        cy.viewport(500, 700)

        cy.get('[data-test=menu-home').should('exist')
           .and('be.not.visible')
         
     })

   






})