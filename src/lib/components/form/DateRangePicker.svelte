<!-- src\lib\components\form\DateRangePicker.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        start?: Date | null;
        end?: Date | null;
        label?: string;
        disabled?: boolean;
        required?: boolean;
        class?: string;
        minDate?: Date | null;
        maxDate?: Date | null;
        minSeparation?: number | null; // in days
        maxSeparation?: number | null; // in days
    }

    let {
        start = $bindable<Date | null>(),
        end = $bindable<Date | null>(),
        label = '',
        disabled = false,
        required = false,
        class: className = '',
        minDate = null,
        maxDate = null,
        minSeparation = null,
        maxSeparation = null,
    }: Props = $props();

    let showCalendar = $state(false);
    let selecting = $state<'start' | 'end'>('start');
    let calendarDate = $state(start ?? new Date());
    let selectedStart = $state(start ?? null);
    let selectedEnd = $state(end ?? null);

    let currentMonth = $derived(() => calendarDate.getMonth());
    let currentYear = $derived(() => calendarDate.getFullYear());

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function getDaysInMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate();
    }

    function isDateDisabled(year: number, month: number, day: number) {
        const date = new Date(year, month, day);
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;

        if (selecting === 'start' && selectedEnd) {
            if (date > selectedEnd) return true;
            if (minSeparation !== null) {
                const minEnd = new Date(date);
                minEnd.setDate(minEnd.getDate() + minSeparation);
                if (selectedEnd < minEnd) return true;
            }
            if (maxSeparation !== null) {
                const maxEnd = new Date(date);
                maxEnd.setDate(maxEnd.getDate() + maxSeparation);
                if (selectedEnd > maxEnd) return true;
            }
        }

        if (selecting === 'end' && selectedStart) {
            if (date < selectedStart) return true;
            if (minSeparation !== null) {
                const minEnd = new Date(selectedStart);
                minEnd.setDate(minEnd.getDate() + minSeparation);
                if (date < minEnd) return true;
            }
            if (maxSeparation !== null) {
                const maxEnd = new Date(selectedStart);
                maxEnd.setDate(maxEnd.getDate() + maxSeparation);
                if (date > maxEnd) return true;
            }
        }

        return false;
    }

    function openCalendar(which: 'start' | 'end') {
        if (!disabled) {
            selecting = which;
            calendarDate = which === 'start'
                ? (selectedStart ?? new Date())
                : (selectedEnd ?? selectedStart ?? new Date());
            showCalendar = true;
        }
    }

    function closeCalendar() {
        showCalendar = false;
    }

    function selectDate(day: number) {
        const date = new Date(currentYear(), currentMonth(), day);
        if (isDateDisabled(currentYear(), currentMonth(), day)) return;

        if (selecting === 'start') {
            selectedStart = date;
            start = date;
            // If end is before start, reset end
            if (selectedEnd && selectedEnd < date) {
                selectedEnd = null;
                end = null;
            }
        } else {
            selectedEnd = date;
            end = date;
        }
        showCalendar = false;
    }

    function prevMonth() {
        if (currentMonth() === 0) {
            calendarDate = new Date(currentYear() - 1, 11, calendarDate.getDate());
        } else {
            calendarDate = new Date(currentYear(), currentMonth() - 1, calendarDate.getDate());
        }
    }

    function nextMonth() {
        if (currentMonth() === 11) {
            calendarDate = new Date(currentYear() + 1, 0, calendarDate.getDate());
        } else {
            calendarDate = new Date(currentYear(), currentMonth() + 1, calendarDate.getDate());
        }
    }

    function prevYear() {
        calendarDate = new Date(currentYear() - 1, currentMonth(), calendarDate.getDate());
    }

    function nextYear() {
        calendarDate = new Date(currentYear() + 1, currentMonth(), calendarDate.getDate());
    }

    function handleClickOutside(event: MouseEvent) {
        if (!(event.target as HTMLElement).closest('.rdp-container')) {
            closeCalendar();
        }
    }
    onMount(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    function getRangeInfo() {
        if (selectedStart && selectedEnd) {
            const diff = Math.floor((selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24));
            return `${diff} days`;
        }
        return '';
    }
</script>

<div class={`space-y-1 rdp-container ${className}`}>
    {#if label}
        <label for="start-date-btn" class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {label}
            {#if required}
                <span class="text-red-500 ml-1">*</span>
            {/if}
        </label>
    {/if}

    <div class="flex gap-2 items-center">
        <button
            id="start-date-btn"
            type="button"
            class="border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-900 text-cyan-600 dark:text-cyan-300 rounded-lg px-4 py-2 font-medium transition hover:bg-cyan-50 dark:hover:bg-cyan-950 disabled:opacity-50"
            onclick={() => openCalendar('start')}
            disabled={disabled}
        >
            {selectedStart
                ? selectedStart.toLocaleDateString()
                : 'Start date'}
        </button>
        <span class="mx-2 text-gray-500 dark:text-gray-400">to</span>
        <button
            type="button"
            class="border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-900 text-cyan-600 dark:text-cyan-300 rounded-lg px-4 py-2 font-medium transition hover:bg-cyan-50 dark:hover:bg-cyan-950 disabled:opacity-50"
            onclick={() => openCalendar('end')}
            disabled={disabled || !selectedStart}
        >
            {selectedEnd
                ? selectedEnd.toLocaleDateString()
                : 'End date'}
        </button>
    </div>

    {#if showCalendar}
        <div class="absolute z-10 mt-2 bg-white dark:bg-gray-900 border border-cyan-300 dark:border-cyan-700 rounded-lg shadow-lg p-4 w-80 rdp-calendar">
            <div class="flex justify-between items-center mb-2">
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={prevYear}>&laquo;</button>
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={prevMonth}>&lt;</button>
                <div class="font-semibold text-cyan-600 dark:text-cyan-300">
                    {calendarDate.toLocaleString('default', { month: 'long' })} {currentYear}
                </div>
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={nextMonth}>&gt;</button>
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={nextYear}>&raquo;</button>
            </div>
            <div class="grid grid-cols-7 gap-1 mb-1">
                {#each daysOfWeek as day}
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-center">{day}</div>
                {/each}
            </div>
            <div class="grid grid-cols-7 gap-1">
                {#each Array(new Date(currentYear(), currentMonth(), 1).getDay()).fill(0) as _}
                    <div></div>
                {/each}
                {#each Array(getDaysInMonth(currentYear(), currentMonth())).fill(0).map((_, i) => i + 1) as day}
                    <button
                        type="button"
                        class={`w-8 h-8 rounded-full text-sm font-medium transition
                            ${selecting === 'start' && selectedStart && selectedStart.getDate() === day && selectedStart.getMonth() === currentMonth() && selectedStart.getFullYear() === currentYear()
                                ? 'bg-cyan-600 text-white dark:bg-cyan-900 dark:text-white'
                                : selecting === 'end' && selectedEnd && selectedEnd.getDate() === day && selectedEnd.getMonth() === currentMonth() && selectedEnd.getFullYear() === currentYear()
                                    ? 'bg-orange-600 text-white dark:bg-orange-700 dark:text-white'
                                    : isDateDisabled(currentYear(), currentMonth(), day)
                                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                                        : 'hover:bg-cyan-50 dark:hover:bg-cyan-950 text-gray-900 dark:text-gray-100'}
                        `}
                        onclick={() => selectDate(day)}
                        disabled={isDateDisabled(currentYear(), currentMonth(), day)}
                    >
                        {day}
                    </button>
                {/each}
            </div>
        </div>
    {/if}

    {#if selectedStart && selectedEnd}
        <div class="flex gap-2 text-xs mt-2">
            <span class="text-gray-500 dark:text-gray-400">Range: <span class="font-medium">{getRangeInfo()}</span></span>
        </div>
    {/if}
</div>

<style>
    .rdp-container { position: relative; }
    .rdp-calendar { position: absolute; left: 0; top: 100%; }
</style>