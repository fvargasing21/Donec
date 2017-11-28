Ext.define('Admin.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    lastView: null,
    onToggleSync:function(self, pressed, eOpts){
       global["sync"] = pressed;
       console.log("sync: ",pressed);
       try{
            socket.emit("onsync",pressed);   
       }catch(err){
            console.log("Error Socket: ",err);        
       }
    },
    onClickUser:function(self,el){
       var mainCardPanel=this.lookupReference('mainCardPanel');

       Ext.create('Ext.menu.Menu', {
           width: 200,
           margin: '0px 10px 10px 0px',
           cls:'x-menu',
           padding:'0',
           bodyStyle:'border-radius:7px;',
           frame:false,
           plain:true,
           defaults:{
               pakcage:'center',
               cls:'item-menu',
               xtype:'menuitem'
           },
           items: [
           /*{
               text: 'Mi Perfil',
               iconCls:'fa fa-user',
               selector:el,
               handler:'onProfile'
           },*/
           /*Ext.create('Admin.view.profile.Social',{
               autoScroll:true
           }),*/
           {
               text: 'Cambiar Contraseña',
               iconCls:'fa fa-key',
               handler:'onChangePass'
           },/*{
               text: 'Configurar',
               iconCls:'fa fa-cog',
               handler:'onPreferences'
           },*/{
               text: 'Salir',
               iconCls:'fa fa-sign-out',
               handler:'onLogout'
           }]
       }).showBy(Ext.get(el),'c-bl',[-10,50]);
    },
    onPreferences:function(self){
        Ext.create('Ext.window.Window', {
           title: 'Configuración',
           width: 400,
           layout: 'fit',
           modal: true,
           constrainHeader: true,
           resizable: false,
           iconCls:'fa fa-cog',
           items: [
                {
                    xtype:'preference'
                }
           ]
       }).show();   
    },
    onChangePass:function(self){
        var me=this;
        me.redirectTo('passwordreset',true);
         // Ext.create('Admin.view.authentication.PasswordReset').show();
        /*Ext.create('Ext.window.Window', {
            title: 'Cambiar Contraseña',
            height: 200,
            width: 400,
            layout: 'fit',
            modal: true,
            constrainHeader: true,
            resizable: false,
            items: [
                Ext.create('Admin.view.authentication.PasswordReset')
            ]
        }).show();*/
    },
    onProfile:function(self){

        Ext.create('Ext.menu.Menu', {
            width: 250,
            margin: '10px 10px 10px 0px',
            cls:'x-menu',
            padding:'0',
            bodyStyle:'border-radius:7px;',
            frame:false,
            plain:true,
            defaults:{
                pakcage:'center',
                cls:'item-menu',
                xtype:'menuitem'
            },
            items: [
                Ext.create('Admin.view.profile.Social',{
                    autoScroll:true
                }) 
            ]
        }).showBy(Ext.get(self.selector),'c-bl',[-70,0]);
    },
    onViewPerfil:function(self){
        var mainCardPanel=this.lookupReference('mainCardPanel');

        Ext.create('Ext.window.Window', {
            title: 'Editar Perfil',
            width: 550,
            layout: 'fit',
            modal: true,
            constrainHeader: true,
            resizable: false,
            items: [
                {
                    html:'Usuario profile'
                }
                // Ext.create('Admin.view.usuario.Perfil')
            ]
        }).show();
    },
    onLogout:function(self){
        var me=this;
        Ext.Msg.confirm('Cerrar Sesión?', 'Desea cerrar la sesión?', function(buttonId, text, v) {
            if(buttonId == 'yes') {
                Ext.Ajax.request({
                    scope: this,
                    url: Constants.URL_LOGOUT_APP,
                    success: function(response) {
                        var responseObject = Ext.decode(response.responseText);
                        localStorage.clear();
                        me.redirectTo('login', true);      
                    },
                    failure: function(response) {
                        Ext.Msg.show({
                            title: 'Error',
                            msg: 'Error al procesar la petición.',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR,
                            fn:function(){
                                localStorage.clear();
                                me.redirectTo('login', true);
                            }
                        });
                    }
                });
            }
        }, this);
    },

    gethashTag:function(node,hashTag){
        var me =this;
        var vm = this.getViewModel();
        var view = (node && node.get('viewType'));

        var instaled = global.instaled;
        if(instaled){
            if(localStorage.length>0){

                if(localStorage.user_id!=undefined){
                    view = hashTag;
                }else{
                    view = hashTag;
                }
            }else{
               view = hashTag;
            }
        }else{
           view = hashTag;
        }
        return view;
    },
    setCurrentView: function(hashTag) {
        hashTag = (hashTag || '').toLowerCase();
        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) ||
                   store.findNode('viewType', hashTag),
            view = this.gethashTag(node,hashTag),
            // view = (node && node.get('viewType')) || (hashTag=='passwordreset')?"passwordreset":"login" || (!localStorage.user_id)?'login':'page404',
            lastView = me.lastView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;
        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();
        
        //@fvargas: Si la vista no existe se crea una nueva, pero si ya existe y se quiere cargar Login se crea nuevamente.
        if (!existingItem || view=='login' || view=='wizard' || view=='offline') {
            newView = Ext.create({
                xtype: view,
                routeId: hashTag,  // for existingItem search later
                hideMode: 'offsets'
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.

            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.senchaLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }

            // Start this layout first since it does not require a layout
            refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            navigationList.el.addCls('nav-tree-animating');

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                    },
                    single: true
                });
            }
        }
    },
    onKeyUp:function(key,event){
    },
    //@fvargs: Renderizar Vista.
    onMainViewRender:function() {
        var vm = this.getViewModel();
        if (!window.location.hash) {
            if(localStorage.user_id!=undefined){
                this.redirectTo(vm.get("defaultToken"));
            }else{
                // this.redirectTo("login");
            }
        }else{
            if(localStorage.length>0){
                var instaled = global.instaled;

                if(instaled){
                    if(localStorage.user_id!=undefined){
                        this.redirectTo(vm.get("defaultToken"));
                    }else{
                        this.redirectTo("login");
                    }
                }else{
                    this.redirectTo("wizard");
                }
            }
            console.log("window.location.hash",window.location.hash)
        }
    },
    onMainViewBeforeRender:function() {
        
        var vm = this.getViewModel();


        
        console.log("Render",localStorage);
        if(localStorage.user_id!=undefined){
            this.redirectTo(vm.get("defaultToken"));
        }else{
            if(localStorage.length>0){
                var instaled = global.instaled;

                if(instaled){
                    if(localStorage.user_id!=undefined){
                        this.redirectTo(vm.get("defaultToken"));
                    }else{
                        this.redirectTo("login");
                    }
                }else{
                    this.redirectTo("wizard");
                }
            }
        }
    },
    //@fvargs: Renderizar Vista.

    onRouteChange:function(id){
        console.log("#"+id);
        this.setCurrentView(id);
    },

    onSearchRouteChange: function () {
        this.setCurrentView('searchresults');
    },

    onSwitchToModern: function () {
        Ext.Msg.confirm('Switch to Modern', 'Are you sure you want to switch toolkits?',
                        this.onSwitchToModernConfirmed, this);
    },

    onSwitchToModernConfirmed: function (choice) {
        if (choice === 'yes') {
            var s = location.search;

            // Strip "?classic" or "&classic" with optionally more "&foo" tokens
            // following and ensure we don't start with "?".
            s = s.replace(/(^\?|&)classic($|&)/, '').replace(/^\?/, '');

            // Add "?modern&" before the remaining tokens and strip & if there are
            // none.
            location.search = ('?modern&' + s).replace(/&$/, '');
        }
    },

    onEmailRouteChange: function () {
        this.setCurrentView('email');
    },

});
