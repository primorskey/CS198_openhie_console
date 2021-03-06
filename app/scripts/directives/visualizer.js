'use strict'
/* global d3: false */
// Visualizer Directive

angular.module('openhimConsoleApp')
  .directive('visualizer', function ($parse) {
    return {
      restrict: 'EA',
      template: '<div id="visualizer"></div>',
      link: function (scope, elem, attrs) {
        // initialize directive data elements
        var data = $parse(attrs.visData)
        var settings = $parse(attrs.visSettings)
        var speedVal = $parse(attrs.visSpeed)

        // initialize global variables
        var components = []
        var channels = []
        var mediators = []
        var himRect, himText, visW, visH, pad, himX, himY, himW, himH, topBarY,
          inactiveColor, activeColor, errorColor, textColor, speed, maxTimeout, minDisplayPeriod,
          vis

        /* ---------- Directive Watchers ---------- */

        // watcher to update the speed of the visualizer
        scope.$watchCollection(speedVal, function (newSpeed) {
          // check if data object exist before processing
          if (newSpeed !== undefined) {
            speed = newSpeed
          }
        })

        /* ---------- Directive Watchers ---------- */

        function getRegistryRect (event) {
          for (var i = 0; i < components.length; i++) {
            if (components[i].eventType === event.type && components[i].eventName.toLowerCase() === event.name.toLowerCase()) {
              return components[i].rect
            }
          }
          return null
        }

        function getChannelText (event) {
          for (var i = 0; i < channels.length; i++) {
            if (channels[i].eventType === event.type && channels[i].eventName.toLowerCase() === event.name.toLowerCase()) {
              return channels[i].text
            }
          }
          return null
        }

        function getMediatorRect (event) {
          for (var i = 0; i < mediators.length; i++) {
            if (mediators[i].mediator === event.mediator) {
              return mediators[i].rect
            }
          }
          return null
        }

        /* Component Drawing */

        function setupBasicComponent (compRect, compText, x, y, w, h, text) {
          compRect
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('x', x)
            .attr('y', y)
            .attr('width', w)
            .attr('height', h)
            .style('fill', inactiveColor)

          var textSize = h / 3.5
          compText
            .attr('x', x + w / 2.0)
            .attr('y', y + h / 2.0 + textSize / 2.0)
            .attr('text-anchor', 'middle')
            .attr('font-size', textSize)
            .text(text)
            .style('fill', textColor)
        }

        function setupRegistryComponent (compRect, compText, compConnector, index, text) {
          var compW = visW / components.length - 2.0 * pad
          var compH = visH / 4.0 - 2.0 * pad
          var compX = index * compW + pad + index * pad * 2.0
          var compY = 0 + pad

          setupBasicComponent(compRect, compText, compX, compY, compW, compH, text)

          compConnector
            .attr('x1', compX + compW / 2.0)
            .attr('y1', compY + compH)
            .attr('x2', compX + compW / 2.0)
            .attr('y2', topBarY)
            .style('stroke-width', visW / 150.0)
            .style('stroke', '#ddd')
        }

        function setupMediatorComponent (compRect, compText, compConnector, index, text) {
          var compW = visW / mediators.length - 2.0 * pad
          var compH = visH / 4.0 - 2.0 * pad
          var compX = index * compW + pad + index * pad * 2.0
          var compY = himY - compH - 0.25 * pad

          setupBasicComponent(compRect, compText, compX, compY, compW, compH, text)
        }

        function setupChannelText (compText, index, text) {
          var compW = visW / channels.length - 2.0 * pad
          var compH = (visH / 4.0 - 2.0 * pad) / 3.0
          var compX = index * compW + pad + index * pad * 2.0
          var compY = visH - pad

          compText
            .attr('x', compX + compW / 2.0)
            .attr('y', compY)
            .attr('text-anchor', 'middle')
            .attr('font-size', compH)
            .text(text)
            .style('fill', inactiveColor)
        }

        function setupHIM (vis) {
          himRect = vis.append('svg:rect')
          himText = vis.append('svg:text')
          setupBasicComponent(himRect, himText, himX, himY, himW, himH, 'Health Information Mediator')

          // top bar
          vis.append('svg:rect')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('x', 0 + pad)
            .attr('y', topBarY)
            .attr('width', visW - 2.0 * pad)
            .attr('height', visH / 50.0)
            .style('fill', inactiveColor)

          // bottom bar
          vis.append('svg:rect')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('x', 0 + pad)
            .attr('y', himY + himH + 0.25 * pad)
            .attr('width', visW - 2.0 * pad)
            .attr('height', visH / 50.0)
            .style('fill', inactiveColor)
        }

        function setupRegistries (vis) {
          for (var i = 0; i < components.length; i++) {
            components[i].rect = vis.append('svg:rect')
            components[i].text = vis.append('svg:text')
            components[i].line = vis.append('svg:line')
            setupRegistryComponent(components[i].rect, components[i].text, components[i].line, i, components[i].display)
          }
        }

        function setupMediators (vis) {
          for (var i = 0; i < mediators.length; i++) {
            mediators[i].rect = vis.append('svg:rect')
            mediators[i].text = vis.append('svg:text')
            mediators[i].line = vis.append('svg:line')
            setupMediatorComponent(mediators[i].rect, mediators[i].text, mediators[i].line, i, mediators[i].display)
          }
        }

        function setupChannels (vis) {
          for (var i = 0; i < channels.length; i++) {
            channels[i].text = vis.append('svg:text')
            setupChannelText(channels[i].text, i, channels[i].display)
          }
        }

        // watcher to find any settings added
        scope.$watchCollection(settings, function (newSettings) {
          // check if settings object exist before creating
          if (newSettings) {
            d3.select('#visualizer').html('')

            components = newSettings.components
            channels = newSettings.channels
            mediators = newSettings.mediators

            visW = newSettings.visW
            visH = newSettings.visH
            pad = newSettings.pad

            himX = 0 + pad
            himY = visH / 1.7
            himW = visW - 2.0 * pad
            himH = visH / 4.0 - 2.0 * pad

            topBarY = himY - (visH / 50.0) - 0.25 * pad
            if (mediators.length > 0) {
              topBarY = topBarY - (visH / 4.0 - 2.0 * pad) - 0.25 * pad
            }

            inactiveColor = newSettings.inactiveColor
            activeColor = newSettings.activeColor
            errorColor = newSettings.errorColor
            textColor = newSettings.textColor

            speed = newSettings.speed
            maxTimeout = newSettings.maxTimeout
            minDisplayPeriod = newSettings.minDisplayPeriod

            // load responsive visualizer
            if (newSettings.visResponsive === true) {
              vis = d3.select('#visualizer')
                .append('svg:svg')
                .attr('viewBox', '0 0 ' + newSettings.visW + ' ' + newSettings.visH)
                .attr('preserveAspectRatio', 'xMinYMin')

              vis.append('svg:rect')
                .attr('width', newSettings.visW)
                .attr('height', newSettings.visH)
            } else {
              // setup fixed size visualizer
              vis = d3.select('#visualizer')
                .append('svg:svg')
                .attr('width', newSettings.visW)
                .attr('height', newSettings.visH)
            }

            // setup the visualizer diagram
            setupHIM(vis)
            setupRegistries(vis)
            setupMediators(vis)
            setupChannels(vis)
          }
        })

        /* Animation */

        function animateComp (comp, event, delay, isError) {
          var color
          var delayMultiplier = 1.0

          if (event.toLowerCase() === 'start') {
            color = activeColor
          } else if (isError) {
            color = errorColor
          } else {
            color = inactiveColor
            delay += minDisplayPeriod
          }

          if (speed < 0) {
            delayMultiplier = -1.0 * speed + 1.0
          } else if (speed > 0) {
            delayMultiplier = 1.0 / (speed + 1.0)
          }

          comp
            .transition()
            .delay(delay * delayMultiplier)
            .style('fill', color)

          if (event.toLowerCase() === 'start' || isError) {
            var timeout
            if (isError) {
              timeout = 1000
            } else {
              timeout = maxTimeout
            }

            comp
              .transition()
              .delay(delay * delayMultiplier + timeout)
              .style('fill', inactiveColor)
          }
        }

        function processEvents (data) {
          if (data.length === 0) {
            return
          }

          var baseTime = data[0].normalizedTimestamp
          var isErrorStatus = function (status) {
            return typeof status !== 'undefined' && status !== null && status.toLowerCase() === 'error'
          }

          angular.forEach(data, function (event) {
            var comp = null

            comp = getRegistryRect(event)
            if (comp === null) {
              comp = getChannelText(event)
              if (typeof comp !== 'undefined' && comp !== null) {
                animateComp(comp, event.event, event.normalizedTimestamp - baseTime, isErrorStatus(event.statusType))
                animateComp(himRect, event.event, event.normalizedTimestamp - baseTime, isErrorStatus(event.statusType))
              }
            } else {
              animateComp(comp, event.event, event.normalizedTimestamp - baseTime, isErrorStatus(event.statusType))
            }

            if (event.mediator) {
              var med = getMediatorRect(event)
              animateComp(med, event.event, event.normalizedTimestamp - baseTime, isErrorStatus(event.statusType))
            }
          })
        }

        // watcher to find any new event data added
        scope.$watchCollection(data, function (newData) {
          // check if data object exist before processing
          if (newData && newData.length > 0) {
            processEvents(newData)
          }
        })
      }
    }
  })
