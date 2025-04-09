export default {
    'panel': {
        'countdown': {
            'tooltip': 'Temporizador'
        },
        'stopwatch': {
            'tooltip': 'Cronómetro'
        },
        'menu': {
            'label': 'Menú'
        }
    },
    'countdown': {
        'title': 'Temporizador',
        'placeholderhours': 'Horas',
        'placeholderminutes': 'Minutos',
        'placeholderseconds': 'Segundos',
        'action': {
            'start': 'Iniciar',
            'pause': 'Pausar',
            'reset': 'Reiniciar',
            'notificationlabel': 'Enviar notificación al finalizar'
        }
    },
    'stopwatch': {
        'title': 'Cronómetro',
        'action': {
            'start': 'Iniciar',
            'pause': 'Pausar',
            'reset': 'Reiniciar',
            'lap': 'Vuelta',
        }
    },
    'weather': {
        'fahrenheit': 'F',
        'celsius': 'C',
        'temperature': 'Temperatura',
        'feelslike': 'Sensación térmica',
        'max': 'Máx',
        'min': 'Mín',
        'wind': 'Viento',
        'mph': 'mph',
        'ms': 'm/s',
        'N': 'N',
        'NNE': 'NNE',
        'NE': 'NE',
        'ENE': 'ENE',
        'E': 'E',
        'ESE': 'ESE',
        'SE': 'SE',
        'SSE': 'SSE',
        'S': 'S',
        'SSW': 'SSO',
        'SW': 'SO',
        'WSW': 'OSO',
        'W': 'O',
        'WNW': 'ONO',
        'NW': 'NO',
        'NNW': 'NNO'
    },
    'menu': {
        'title': 'Menú',
        'section': {
            'datetime': {
                'header': 'Fecha y hora',
                'setting': {
                    'clockmode': {
                        'title': 'Modo de reloj',
                        'option': {
                            '12': '12-hora',
                            '24': '24-hora'
                        }
                    },
                    'timezone': {
                        'title': 'Zona horaria'
                    },
                    'displaysystem': {
                        'title': 'Sistema de visualización',
                        'option': {
                            'radix': {
                                'title': 'Sistemas de numeración',
                                'binary': 'Binario (Base 2)',
                                'octal': 'Octal (Base 8)',
                                'decimal': 'Decimal (Base 10)',
                                'hexadecimal': 'Hexadecimal (Base 16)',
                                'hexatrigesimal': 'Hexatrigesimal (Base 36)'
                            },
                            'conversions': {
                                'title': 'Conversiones',
                                'emoji': 'Emoji (1️⃣2️⃣:0️⃣0️⃣)',
                                'romannumeral': 'Numero romano (XII:00)',
                                'words': 'Palabras (twelve:o\'clock)'
                            },
                            'technical': {
                                'title': 'Técnico',
                                'unixms': 'Tiempo Unix (ms)',
                                'unixsec': 'Tiempo Unix (seg)',
                                'y2k38': 'Tiempo hasta el problema Y2K38'
                            },
                            'specialevents': {
                                'title': 'Eventos especiales',
                                'valentines': 'Tiempo hasta el Día de San Valentín',
                                'christmas': 'Tiempo hasta la Navidad',
                                'newyear': 'Tiempo hasta el Año Nuevo'
                            },
                            'isit': {
                                'title': 'Es...',
                                'christmas': '...Navidad?',
                                'weekend': '...fin de semana?',
                                'leapyear': '...un año bisiesto?',
                            }
                        }
                    },
                    'secondsdisplay': {
                        'title': 'Mostrar segundos',
                        'option': {
                            'show': 'Mostrar',
                            'hide': 'Ocultar'
                        }
                    },
                    'timebar': {
                        'title': 'Barra de tiempo',
                        'option': {
                            'week': 'Progreso de la semana (Lun-Dom)',
                            'month': 'Progreso del mes',
                            'day': 'Progreso del día',
                            'hour': 'Progreso de la hora',
                            'seconds': 'Segundos',
                            'off': 'Apagar'
                        }
                    },
                    'datedisplay': {
                        'title': 'Date Display',
                        'option': {
                            'localized': {
                                'title': 'Localizado',
                            },
                            'standard': {
                                'title': 'Estándar',
                            },
                            'off': 'Apagar'
                        }
                    },
                    'datealignment': {
                        'title': 'Alineación de la fecha',
                        'option': {
                            'left': 'Izquierda',
                            'center': 'Centro',
                            'right': 'Derecha'
                        }
                    },
                    'borderstyle': {
                        'title': 'Estilo de borde',
                        'option': {
                            'none': 'Ninguno',
                            'box': 'Caja',
                            'bottom': 'Inferior',
                            'solid': 'Sólido',
                            'dashed': 'Rayado',
                            'dotted': 'Punteado',
                            'double': 'Doble'
                        }
                    },
                    'customnote': {
                        'title': 'Nota personalizada',
                        'placeholder': 'Ingrese texto aquí'
                    },
                    'notealignment': {
                        'title': 'Alineación de la nota',
                        'option': {
                            'top': 'Superior',
                            'bottom': 'Inferior'
                        }
                    },
                    'timerefreshmethod': {
                        'title': 'Método de actualización',
                        'label': 'Usar método de actualización heredado',
                        'description': 'Habilitar si experimentas inestabilidad en el reloj en Firefox o navegadores no basados en Chromium (actualiza el reloj cada 100 ms).'
                    }
                }
            },
            'fontcustomization': {
                'header': 'Personalización de fuente',
                'setting': {
                    'fontfamily': {
                        'title': 'Familia de fuentes',
                        'option': {
                            'default': 'Predeterminado del sistema',
                            'sansserif': {
                                'title': 'Sin serifas'
                            },
                            'serif': {
                                'title': 'Con serifas'
                            },
                            'handwritten': {
                                'title': 'Escritura a mano'
                            }
                        }
                    },
                    'customfont': {
                        'title': 'Fuente personalizada',
                        'tooltip': 'Ingresa el nombre de una fuente instalada en tu sistema',
                        'placeholder': 'Ingresa el nombre de la fuente...',
                        'submit': 'Enviar'
                    },
                    'fontstyle': {
                        'title': 'Estilo de fuente',
                        'option': {
                            'regular': 'Regular',
                            'italic': 'Cursiva'
                        }
                    },
                    'fontweight': {
                        'title': 'Grosor de fuente',
                        'option': {
                            'light': 'Ligera',
                            'normal': 'Normal',
                            'bold': 'Negrita'
                        }
                    },
                    'fontsize': {
                        'title': 'Tamaño de fuente',
                        'option': {
                            'smaller': 'Más pequeño (6vw)',
                            'small': 'Pequeño (8vw)',
                            'default': 'Normal (10vw)',
                            'large': 'Grande (12vw)',
                            'larger': 'Más grande (14vw)',
                            'huge': 'Enorme (18vw)',
                        }
                    },
                    'texteffects': {
                        'title': 'Efectos de texto',
                        'option': {
                            'dropshadow': 'Sombra paralela',
                            'strokewidth': 'Ancho del contorno',
                            'strokecolor': 'Color del contorno'
                        }
                    },
                }
            },
            'backgroundtheme': {
                'header': 'Tema de fondo',
                'setting': {
                    'backgroundcolormode': {
                        'title': 'Modo de color de fondo',
                        'option': {
                            'colorfade': 'Degradado',
                            'solid': 'Sólido',
                            'image': 'Imagen',
                            'currentcolor': 'Color actual:'
                        }
                    },
                    'colortransition': {
                        'title': 'Transición de Color',
                        'option': {
                            'length': 'Duración',
                            'reset': 'Restablecer',
                            'tooltip': 'Restablecer duración al valor predeterminado.'
                        }
                    },
                    'basiccolors': {
                        'title': 'Colores básicos',
                        'tooltip': {
                            'basicred': 'Rojo básico',
                            'basicorange': 'Naranja básico',
                            'basicyellow': 'Amarillo básico',
                            'basicgreen': 'Verde básico',
                            'basicblue': 'Azul básico',
                            'basicmagenta': 'Magenta básico',
                            'basicwhite': 'Blanco básico',
                            'basicgray': 'Gris básico',
                            'basicblack': 'Negro básico'
                        }
                    },
                    'brightcolors': {
                        'title': 'Colores brillantes',
                        'tooltip': {
                            'palepink': 'Rosa pálido',
                            'paleblue': 'Azul pálido',
                            'lavender': 'Lavanda',
                            'powderblue': 'Polvo azul',
                            'palepeach': 'Durazno pálido',
                            'mintgreen': 'Verde menta',
                            'periwinkleblue': 'Azul lavanda',
                            'apricot': 'Albaricoque',
                            'dustyrose': 'Rosa envejecido',
                            'seafoamgreen': 'Verde espuma de mar',
                            'mauve': 'Malva',
                            'lilac': 'Lila'
                        }
                    },
                    'deepcolors': {
                        'title': 'Colores profundos',
                        'tooltip': {
                            'deeppink': 'Rosa intenso',
                            'deepblue': 'Azul intenso',
                            'deeplavender': 'Lavanda intenso',
                            'deeppowderblue': 'Polvo azul intenso',
                            'deeppeach': 'Durazno intenso',
                            'darkmintgreen': 'Verde menta oscuro',
                            'deepperiwinkleblue': 'Azul lavanda profundo',
                            'deepapricot': 'Albaricoque intenso',
                            'deepdustyrose': 'Rosa polvoriento intenso',
                            'deepseafoamgreen': 'Verde espuma de mar profundo',
                            'deepmauve': 'Malva intenso',
                            'darklilac': 'Lila oscuro'
                        }
                    },
                    'backgroundimage': {
                        'title': 'Imagen de fondo',
                        'option': {
                            'uploadimage': 'Subir imagen'
                        }
                    },
                    'imageeffects': {
                        'title': 'Efectos de imagen',
                        'option': {
                            'sizing': 'Tamaño:',
                            'automatic': 'Automático',
                            'cover': 'Cubrir',
                            'stretch': 'Estirar',
                            'imageblur': 'Desenfoque de imagen',
                            'imageblurdescription': 'Nota: Puede consumir más energía cuando está activo',
                        }
                    },
                    'textcoloroverride': {
                        'title': 'Sobrescritura del color de texto',
                        'option': {
                            'disabled': 'Desactivado',
                            'enabled': 'Activado',
                            'textcolor': 'Color del texto'
                        }
                    }
                }
            },
            'weather': {
                'header': 'Clima',
                'setting': {
                    'appid': {
                        'title': 'OpenWeatherMap AppID',
                        'option': {
                            'placeholder': 'Clave API',
                            'link': 'Encuentra tu clave API'
                        }
                    },
                    'location': {
                        'title': 'Ubicación',
                        'option': {
                            'latitude': 'Latitud',
                            'longitude': 'Longitud',
                            'getlocation': 'Obtener ubicación',
                        }
                    },
                    'units': {
                        'title': 'Unidades',
                        'option': {
                            'imperial': 'Imperial',
                            'metric': 'Métrico',
                        }
                    },
                    'action': {
                        'disable': 'Desactivar',
                        'enable': 'Activar',
                    },
                    'widgetpos': {
                        'title': 'Posición del widget',
                        'option': {
                            'toggle': 'Activar mover con arrastre',
                            'reset': 'Restablecer posición...',
                            'description': 'Nota: ¡Después de activar, arrastra el widget con el cursor!'
                        }
                    },
                    'privacy': 'Revisar la Política de Privacidad'
                },
            },
            'displayoptions': {
                'header': 'Opciones de visualización',
                'setting': {
                    'language': {
                        'title': 'Idioma'
                    },
                    'menutheme': {
                        'title': 'Tema del menú',
                        'option': {
                            'light': 'Claro',
                            'dark': 'Oscuro'
                        }
                    },
                    'panelvisibility': {
                        'title': 'Visibilidad del panel',
                        'option': {
                            'label': 'Mostrar botones del panel',
                            'description': 'Haz doble clic en la pantalla para hacer los botones visibles nuevamente'
                        }
                    },
                    'tabtitle': {
                        'title': 'Título de la pestaña',
                        'option': {
                            'label': 'Mostrar la hora actual en el título de la pestaña'
                        }
                    },
                    'fullscreen': {
                        'title': 'Modo de pantalla completa',
                        'option': {
                            'toggle': 'Alternar vista'
                        }
                    }
                }
            },
            'debugging': {
                'header': 'Depuración',
                'setting': {
                    'debuginfo': {
                        'title': 'Información de depuración',
                        'option': {
                            'useragent': 'Agente de usuario',
                            'locale': 'Idioma/Ubicación',
                            'timezone': 'Zona horaria',
                            'loadtime': 'Tiempo de carga',
                            'resolution': 'Resolución',
                            'colordepth': 'Profundidad de color',
                            'onlinestatus': 'Estado en línea'
                        }
                    },
                    'devcolors': {
                        'title': 'Colores de desarrollo',
                        'option': {
                            'jekylldark': 'Jekyll Oscuro',
                            'firefoxdark': 'Firefox Oscuro',
                            'chromedark': 'Chrome Oscuro',
                            'githubdark': 'GitHub Oscuro',
                            'vscodedark': 'VS Code Oscuro',
                            'windowsdark': 'Windows Oscuro',
                            'bootstrapdark1': 'Bootstrap Oscuro 1',
                            'bootstrapdark2': 'Bootstrap Oscuro 2',
                            'description': 'Nota: Estos colores no deben ser exportados. Si se importan, la verificación fallará.'
                        }
                    },
                    'settings': {
                        'title': 'Configuración',
                        'option': {
                            'logjson': 'Registro JSON',
                            'viewrawjson': 'Ver JSON sin procesar',
                            'extractbgimg': 'Extraer imagen de fondo',
                        }
                    },
                    'toasts': {
                        'title': 'Mensajes emergentes (Toasts)',
                        'option': {
                            'dark': 'Oscuro',
                            'light': 'Claro',
                            'danger': 'Peligro',
                            'success': 'Éxito',
                            'warning': 'Advertencia'
                        }
                    },
                    'ui': {
                        'title': 'UI',
                        'option': {
                            'removeclock': 'Eliminar contenedor del reloj'
                        }
                    },
                    'localstorage': {
                        'title': 'localStorage (Almacenamiento local)',
                        'option': {
                            'clear': 'Borrar localStorage',
                        }
                    }
                }
            },
            'importexport': {
                'header': 'Ajustes de Importación/Exportación',
                'setting': {
                    'importsettings': {
                        'title': 'Importar ajustes',
                        'option': {
                            'uploadjson': 'Subir desde JSON',
                            'scanqrcode': 'Escanear código QR',
                            'manualtext': 'O pegar manualmente los ajustes en formato JSON aquí:',
                            'placeholder': 'Pega el JSON aquí',
                            'load': 'Cargar ajustes'
                        }
                    },
                    'presets': {
                        'title': 'Ajustes predefinidos',
                        'description': 'Nota: Pulsa <kbd>h</kbd> para ver los accesos directos del teclado.'
                    },
                    'exportsettings': {
                        'title': 'Exportar ajustes',
                        'option': {
                            'downloadjson': 'Descargar JSON',
                            'copyjson': 'Copiar JSON',
                            'genqrcode': 'Generar código QR',
                            'description': 'Nota: Las opciones de visualización y los ajustes personalizados de fuente no serán exportados.'
                        }
                    }
                }
            }
        },
        'misc': {
            'pageduration': {
                'label': 'Llevas aquí por:',
                'negativetime': '¿Tiempo negativo?? 🤔',
                'daycount': '{{0}}d, {{1}}h, y {{2}}m',
                'hourcount': '{{0}}h, {{1}}m, y {{2}}s',
                'minutecount': '{{0}} min, y {{1}} seg',
                'secondcount': '{{0}} segundos'
            },
            'autorestart': {
                'label': 'Reinicio automático'
            },
            'docs': {
                'label': 'Leer la documentación',
                'tooltip': 'Ver la documentación de Online Web Clock'
            },
            'github': {
                'tooltip': 'Ver el código fuente en GitHub'
            },
            'versionlabel': 'Versión'
        },
    },
    'toasts': {
        'countdown': {
            'finished': '¡Temporizador terminado!',
            'finishednotification': 'Tu temporizador ha finalizado. Ahora es {{0}}',
            'toolong': '¡El tiempo establecido es demasiado largo! Asegúrate de que sea menos de 100 horas.',
            'notificationdenied': 'Permiso de notificación denegado.',
        },
        'global': {
            'themelight': 'Tema establecido en modo claro ☀️',
            'themedark': 'Tema establecido en modo oscuro 🌙',
            'fullscreen': 'Modo de pantalla completa activado',
        },
        'importexport': {
            'exportsuccess': '¡Ajustes exportados! Tomó {{0}}ms',
            'exportcopysuccess': '¡Ajustes copiados! Tomó {{0}}ms',
            'exportrawsuccess': 'JSON exportado. Tomó {{0}}ms',
            'exportqrtoolarge': '¡Ajustes demasiado grandes para el código QR! Consulta la consola para más detalles.',
            'exportqrsuccess': '¡Ajustes exportados a código QR! Tomó {{0}}ms',
            'exporting': 'Exportando ajustes...',
            'exporterror': '¡Error al exportar ajustes! Consulta la consola para más detalles.',
            'importsuccess': '¡Ajustes importados con éxito!<hr><b>Fecha del archivo:</b> {{0}}',
            'importerror': 'Archivo de ajustes no válido. Asegúrate de que el archivo contenga JSON válido.',
            'fetcherror': 'No se pudo obtener el archivo de ajustes local. Verifica el nombre del archivo y asegúrate de que exista.',
            'nobgimg': 'No hay imagen de fondo para extraer.',
        },
        'debugui': {
            'testtoast': 'Prueba de mensaje emergente. Tema "{{0}}"',
            'clearls': 'Almacenamiento local borrado.',
        },
        'domutils': {
            'textcopied': '¡Texto copiado al portapapeles!',
            'notificationunsupported': 'Las notificaciones no son compatibles con este navegador.',
            'qrscannerfailed': 'Error en el escáner QR: {{0}}',
        },
        'urlparams': {
            'debugmode': 'Modo de depuración habilitado. La memoria de DevTools aumentará con el tiempo.',
            'autorestart': 'Reinicio automático configurado a {{0}} segundos.'
        },
        'weatherutils': {
            'gpserror': 'Error al obtener la ubicación: {{0}}',
            'gpsunsupported': 'La geolocalización no es compatible con este navegador.',
            'weathererror': 'Error al obtener los datos meteorológicos: {{0}}',
        }
    },
    'bsmodal': {
        'action': {
            'close': 'Cerrar',
            'copy': 'Copiar',
            'download': 'Descargar',
            'countdownel': 'Cerrando en {{0}}s',
            'gethelp': 'Obtener ayuda'
        },
        'rawsettingsjson': 'JSON de ajustes sin procesar',
        'backgroundimage': 'Imagen de fondo',
        'importerror': '¡Error al importar ajustes!'
    },
    'scanneroverlay': {
        'action': {
            'close': 'Cerrar'
        }
    },
    'arialabel': {
        'menuclose': 'Cerrar',
        'clockmodebuttongroup': 'Grupo de botones de modo de reloj',
        'secondsvisibilitybuttongroup': 'Grupo de botones de visibilidad de segundos',
        'datepositionbuttongroup': 'Grupo de botones de posición de la fecha',
        'clockborderradiobuttongroup': 'Grupo de botones de radio de borde del reloj',
        'notealignmentbuttongroup': 'Grupo de botones de alineación de notas',
        'customfontinputform': 'Formulario de entrada de fuente personalizada',
        'fontstylebuttongroup': 'Grupo de botones de estilo de fuente',
        'fontweightbuttongroup': 'Grupo de botones de grosor de fuente',
        'colormodebuttongroup': 'Grupo de botones de modo de color',
        'solidcolorbuttongroup': 'Grupo de botones de color sólido',
        'textcoloroverridebuttongroup': 'Grupo de botones de anulación de color de texto',
        'weatherunitbuttongroup': 'Grupo de botones de unidad meteorológica',
        'languagebuttongroup': 'Grupo de botones de idioma',
        'menuthemebuttongroup': 'Grupo de botones de tema del menú',
        'manualjsonsettingsentryform': 'Formulario de entrada manual de configuraciones JSON',
        'stopwatchcontrols': 'Controles del cronómetro',
        'countdowncontrols': 'Controles del temporizador'
    }
};