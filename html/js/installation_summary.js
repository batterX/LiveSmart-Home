$container.trigger('step', 7);





function getImageDimensions(file) {
    return new Promise (function (resolved, rejected) {
        var i = new Image()
        i.onload = function(){
            resolved({w: i.width, h: i.height})
        };
        i.src = file
    })
}





$('#btnDownload').on('click', function() {
    html2canvas(document.querySelector('#summary'), {
        windowWidth: 750,
        scale: 2
    }).then(async canvas => {
        var img = canvas.toDataURL('image/png');
        var dimensions = await getImageDimensions(img);
        console.log(dimensions);
        var ratio = dimensions.w / dimensions.h;
        var pdf = new jsPDF("portrait", "mm", "a4");
        pdf.addImage(img, 'PNG', 20, 20, 120, 120 / ratio);
        pdf.save("Installation Summary.pdf");
    });
});





$('#btnFinishInstallation').on('click', function() {

    var data = {
        action: 'finish_installation'
    };

    if(dataObj.hasOwnProperty('installer_gender'      ) && dataObj['installer_gender'      ] != "") data['installer_gender'      ] = dataObj['installer_gender'      ];
    if(dataObj.hasOwnProperty('installer_firstname'   ) && dataObj['installer_firstname'   ] != "") data['installer_firstname'   ] = dataObj['installer_firstname'   ];
    if(dataObj.hasOwnProperty('installer_lastname'    ) && dataObj['installer_lastname'    ] != "") data['installer_lastname'    ] = dataObj['installer_lastname'    ];
    if(dataObj.hasOwnProperty('installer_company'     ) && dataObj['installer_company'     ] != "") data['installer_company'     ] = dataObj['installer_company'     ];
    if(dataObj.hasOwnProperty('installer_email'       ) && dataObj['installer_email'       ] != "") data['installer_email'       ] = dataObj['installer_email'       ];
    if(dataObj.hasOwnProperty('installer_password'    ) && dataObj['installer_password'    ] != "") data['installer_password'    ] = dataObj['installer_password'    ];

    if(dataObj.hasOwnProperty('customer_gender'       ) && dataObj['customer_gender'       ] != "") data['customer_gender'       ] = dataObj['customer_gender'       ];
    if(dataObj.hasOwnProperty('customer_firstname'    ) && dataObj['customer_firstname'    ] != "") data['customer_firstname'    ] = dataObj['customer_firstname'    ];
    if(dataObj.hasOwnProperty('customer_lastname'     ) && dataObj['customer_lastname'     ] != "") data['customer_lastname'     ] = dataObj['customer_lastname'     ];
    if(dataObj.hasOwnProperty('customer_email'        ) && dataObj['customer_email'        ] != "") data['customer_email'        ] = dataObj['customer_email'        ];
    if(dataObj.hasOwnProperty('customer_telephone'    ) && dataObj['customer_telephone'    ] != "") data['customer_telephone'    ] = dataObj['customer_telephone'    ];
    if(dataObj.hasOwnProperty('customer_country'      ) && dataObj['customer_country'      ] != "") data['customer_country'      ] = dataObj['customer_country'      ];
    if(dataObj.hasOwnProperty('customer_city'         ) && dataObj['customer_city'         ] != "") data['customer_city'         ] = dataObj['customer_city'         ];
    if(dataObj.hasOwnProperty('customer_zipcode'      ) && dataObj['customer_zipcode'      ] != "") data['customer_zipcode'      ] = dataObj['customer_zipcode'      ];
    if(dataObj.hasOwnProperty('customer_address'      ) && dataObj['customer_address'      ] != "") data['customer_address'      ] = dataObj['customer_address'      ];

    if(dataObj.hasOwnProperty('installation_country'  ) && dataObj['installation_country'  ] != "") data['installation_country'  ] = dataObj['installation_country'  ];
    if(dataObj.hasOwnProperty('installation_city'     ) && dataObj['installation_city'     ] != "") data['installation_city'     ] = dataObj['installation_city'     ];
    if(dataObj.hasOwnProperty('installation_zipcode'  ) && dataObj['installation_zipcode'  ] != "") data['installation_zipcode'  ] = dataObj['installation_zipcode'  ];
    if(dataObj.hasOwnProperty('installation_address'  ) && dataObj['installation_address'  ] != "") data['installation_address'  ] = dataObj['installation_address'  ];

    if(dataObj.hasOwnProperty('system_serial'         ) && dataObj['system_serial'         ] != "") data['system_serial'         ] = dataObj['system_serial'         ];

    if(dataObj.hasOwnProperty('device_serial'         ) && dataObj['device_serial'         ] != "") data['device_serial'         ] = dataObj['device_serial'         ];
    if(dataObj.hasOwnProperty('device_model'          ) && dataObj['device_model'          ] != "") data['device_model'          ] = dataObj['device_model'          ];
    if(dataObj.hasOwnProperty('solar_wattPeak'        ) && dataObj['solar_wattPeak'        ] != "") data['solar_wattPeak'        ] = dataObj['solar_wattPeak'        ];
    if(dataObj.hasOwnProperty('solar_feedInLimitation') && dataObj['solar_feedInLimitation'] != "") data['solar_feedInLimitation'] = dataObj['solar_feedInLimitation'];
        
    if(dataObj.hasOwnProperty('box_apikey'            ) && dataObj['box_apikey'            ] != "") data['box_apikey'            ] = dataObj['box_apikey'            ];
    if(dataObj.hasOwnProperty('box_serial'            ) && dataObj['box_serial'            ] != "") data['box_serial'            ] = dataObj['box_serial'            ];
    if(dataObj.hasOwnProperty('software_version'      ) && dataObj['software_version'      ] != "") data['software_version'      ] = dataObj['software_version'      ];
    
    if(dataObj.hasOwnProperty('battery1_serial'       ) && dataObj['battery1_serial'       ] != "") data['battery1_serial'       ] = dataObj['battery1_serial'       ];
    if(dataObj.hasOwnProperty('battery2_serial'       ) && dataObj['battery2_serial'       ] != "") data['battery2_serial'       ] = dataObj['battery2_serial'       ];
    if(dataObj.hasOwnProperty('battery3_serial'       ) && dataObj['battery3_serial'       ] != "") data['battery3_serial'       ] = dataObj['battery3_serial'       ];
    if(dataObj.hasOwnProperty('battery4_serial'       ) && dataObj['battery4_serial'       ] != "") data['battery4_serial'       ] = dataObj['battery4_serial'       ];

    $.post({
        url: "https://api.batterx.io/v2/installation.php",
        data: data,
        success: function(response) {
            if(response === "1")
                alert("Everything Created & Set-up Successfully");
            else
                alert("Error: " + response);
        },
        error: function() { alert("An error has occured. Please refresh this page!"); }
    });

    //alert("Send Confirmation Email (with button to resend)");
    //alert("In Email: 'Activate Warranty' button");
    //alert("On Click -> Open Login Page -> Login User -> Activate Stuff");

});
