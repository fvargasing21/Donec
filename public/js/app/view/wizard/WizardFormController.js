/**
 * @class Admin.view.authentication.WizardFormController
 */
Ext.define('Admin.view.wizard.WizardFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizardform_c',


    init: function(view) {
        var tb = this.lookupReference('navigation-toolbar'),
            buttons = tb.items.items,
            ui = view.colorScheme;

        //Apply styling buttons
        if (ui) {
            buttons[1].setUI(ui);
            buttons[2].setUI(ui);
        }
    },

    onNextClick: function(button) {
        //This is where you can handle any logic prior to moving to the next card
        var panel = button.up('panel');
        panel.getViewModel().set('atBeginning', false);
        
        try{
            this.navigate(button, panel, 'next');
        }catch(err){
            console.log(err.message)
        }
    },

    onPreviousClick: function(button) {
        var panel = button.up('panel');

        panel.getViewModel().set('atEnd', false);
        
        this.navigate(button, panel, 'prev');
    },   
    onFinishClick: function(button) {
        var self = this;
        var panel = button.up('panel');
        var layout = panel.getLayout(),
        vm = panel.getViewModel();

        Ext.Ajax.request({
              scope: this,
              url: Constants.URL_WIZARD,
              params: vm.get("payloads"),
              success: function(response) {
                location.reload();    
              },
              failure: function(response) {
                  Ext.Msg.show({
                      title: 'Error',
                      msg: 'Error al procesar la petición.',
                      buttons: Ext.Msg.OK,
                      icon: Ext.Msg.ERROR
                  });
              }
        });
    },

    navigate: function(button, panel, direction) {
        var layout = panel.getLayout(),
            progress = this.lookupReference('progress'),
            model = panel.getViewModel(),
            progressItems = progress.items.items,
            item, i, activeItem, activeIndex;

        var finishButton = Ext.getCmp('finishButton');
        var volButton = Ext.getCmp('vol_btn');
        var sigButton = Ext.getCmp('sig_btn');
        var password = panel.down("[name=password]");
        var re_password = panel.down("[name=re_password]");    
        layout[direction]();

        activeItem = layout.getActiveItem();
        activeIndex = panel.items.indexOf(activeItem);

        if (activeIndex === 3) {
            if (password.getValue()!=re_password.getValue()) {
                Ext.Msg.show({
                        title : 'Info',
                        msg : 'Las contraseñas no coinciden, Por favor verifique.',
                        width : 300,
                        closable : false,
                        buttons : Ext.Msg.OK,
                        buttonText : 
                        {
                            ok : 'Regresar'
                        },
                        multiline : false,
                        fn : function(buttonValue, inputText, showConfig){
                            volButton.fireEvent('click', volButton);
                        },
                        icon : Ext.Msg.QUESTION
                });
                return;
            }
        }

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (activeIndex === item.step) {
                item.setPressed(true);
            }
            else {
                item.setPressed(false);
            }
        }
        console.log(button.id);
        if(activeIndex == (progressItems.length -1)){
            // model.set('atEnd', true);
            var panel = button.up("wizard-panel"),
            params={},
            valid=true;
            Ext.Array.each(panel.query('field'),function(item,index){
                params[item.name]=item.getValue();
                if(!item.isValid()){
                    valid=false;
                }
            });
            //volButton.hide();
            sigButton.hide();
            if(valid){
                finishButton.show();
                model.set("payloads",params);
            }else{
                Ext.Msg.show({
                    title: 'Atención',
                    msg: 'Algunos campos son requeridos.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING,
                    fn : function(buttonValue, inputText, showConfig){
                        volButton.fireEvent('click', volButton);
                    }                    
                });
            }
        }else{
            if(activeIndex >0){
                volButton.show();
            }else{
                volButton.hide();
            }
            sigButton.show();
            finishButton.hide();
        }
        console.info(button.id=='finishButton',button.id);
        if(button.id=='finishButton'){
            
        }
        return;
    }
});
